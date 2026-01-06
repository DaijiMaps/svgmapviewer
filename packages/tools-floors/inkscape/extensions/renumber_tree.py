#!/usr/bin/env python3
# coding=utf-8

import daijimaps
import re


class RenumberTree(daijimaps.AddressTree):
    def _is_anonymous(self, node):
        # - no label
        # - or label NOT starting with [A-Z]
        if node.label is None:
            return True
        return re.match('^[A-Z]', node.label) is None

    def _check_children(self, node):
        # All children should be anonymous (renumber-able)
        for child in list(node):
            if child.label and self._ignoring(child):
                return False
            if not self._is_anonymous(child):
                return False
        return True

    def _visitor_node_branch_renumber(self, node, parents):
        renumbering = self._check_children(node)
        if renumbering:
            daijimaps.renumber_group(node)

    def _visitor_node_branch(self, node, parents):
        self._visitor_node_branch_renumber(node, parents)

    def effect(self):
        super().effect()


if __name__ == "__main__":
    RenumberTree().run()
