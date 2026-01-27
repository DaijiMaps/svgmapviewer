#!/usr/bin/env python3
# coding=utf-8

import inkex


group_styles = {"display"}


class FlattenStyle(inkex.EffectExtension):
    def _flatten_style(self, node):
        if isinstance(node, inkex.Group):
            ss = {}
            for y in group_styles:
                if y in node.style:
                    ss[y] = node.style[y]
            for child in list(node):
                child.style.add_inherited(node.style)
            node.style = ss
        for child in list(node):
            self._flatten_style(child)
        return True

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._flatten_style(node)


if __name__ == "__main__":
    FlattenStyle().run()
