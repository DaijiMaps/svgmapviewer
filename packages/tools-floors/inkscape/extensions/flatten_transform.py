#!/usr/bin/env python3
# coding=utf-8

import inkex


class FlattenTransform(inkex.EffectExtension):
    def _flatten_Transform(self, node):
        node.bake_transforms_recursively()
        return True

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._flatten_Transform(node)


if __name__ == "__main__":
    FlattenTransform().run()
