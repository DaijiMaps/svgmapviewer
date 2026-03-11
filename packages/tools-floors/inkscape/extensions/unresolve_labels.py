#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps.name
import daijimaps.resolve_labels


class UnresolveLabels(daijimaps.resolve_labels.ResolveLabels):
    def _move_resolved_label(
        self,
        labels_group: inkex.Group,
        unresolved_labels_group: inkex.Group,
        new_name: str,
        t: inkex.TextElement,
    ) -> None:
        old_name = t.label
        daijimaps.name.move_label(
            labels_group, unresolved_labels_group, old_name, new_name
        )

    def _move_resolved_labels(
        self, labels_group: inkex.Group, unresolved_labels_group: inkex.Group
    ) -> None:
        for name, t in self._resolved_labels.items():
            self.msg(f"moving label: {name}")
            self._move_resolved_label(labels_group, unresolved_labels_group, name, t)
        self._sort_children(unresolved_labels_group)

    def _process_addresses(self, node: inkex.Group) -> None:
        self.msg("=== unresolve: start")

        unresolved_labels_group = self._prepare_unresolved_labels_group(node)
        labels_group = self._prepare_labels_group(node)

        if labels_group is None:
            self.msg("(Labels) group does not exist!")
            return
        if unresolved_labels_group is None:
            self.msg("(Unresolved Labels) group does not exist!")
            return

        self._move_resolved_labels(labels_group, unresolved_labels_group)

        # self._read_unresolved_labels(unresolved_labels_group)
        # self._read_resolved_labels(labels_group)

        self.msg("=== unresolve: end")


if __name__ == "__main__":
    UnresolveLabels().run()
