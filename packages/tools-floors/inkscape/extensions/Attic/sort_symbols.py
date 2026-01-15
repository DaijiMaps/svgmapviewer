#!/usr/bin/env python3
# coding=utf-8

import inkex
import re


PER_ROW = 20


class SortSymbols(inkex.EffectExtension):
    def _sort_symbols(self, node):
        if not isinstance(node, inkex.Group):
            return False
        max_width = 0
        max_height = 0
        for child in list(node):
            label = child.label
            if not label:
                return False
            if not re.match("^[A-Z].*$", label):
                return False
            bb = child.shape_box()
            if bb is None:
                return False
            size = bb.size
            max_width = max(max_width, size.x)
            max_height = max(max_height, size.y)
        children = sorted(list(node), key=lambda e: e.label if e.label else "")
        for child in children:
            node.remove(child)
        for i, child in enumerate(children):
            x = i % PER_ROW
            y = int(i / PER_ROW)
            tx = x * max_width * 1.25
            ty = y * max_height * 1.25
            child.transform = inkex.Transform(f"translate({tx}, {ty})")
            node.append(child)
        return True

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._sort_symbols(node)


if __name__ == "__main__":
    SortSymbols().run()
