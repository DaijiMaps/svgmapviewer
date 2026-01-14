#!/usr/bin/env python3
# coding=utf-8

import math

import inkex


def _is_translate(t: inkex.Transform):
    return not (math.isclose(t.e, 0) and math.isclose(t.f, 0))


def _is_translate_only(t: inkex.Transform):
    p = [t.a, t.b, t.c, t.d]
    q = [1, 0, 0, 1]
    is_unit = all(map(math.isclose, p, q))
    return is_unit and _is_translate(t)


def _translate_x_y(node, t, ax="x", ay="y"):
    x = node.get(ax) or 0
    y = node.get(ay) or 0
    node.set(ax, f"{float(x) + t.e:.3g}")
    node.set(ay, f"{float(y) + t.f:.3g}")
    if node.transform:
        del node.attrib["transform"]


def _translate_cx_cy(node, t):
    _translate_x_y(node, t, "cx", "cy")


class FlattenTransform(inkex.EffectExtension):
    def _flatten_translate(self, node):
        t = node.transform
        translate_only = _is_translate_only(t)
        if translate_only:
            if isinstance(node, inkex.Use) or isinstance(node, inkex.Rectangle):
                _translate_x_y(node, t)
            elif isinstance(node, inkex.Circle) or isinstance(node, inkex.Ellipse):
                _translate_cx_cy(node, t)
            elif isinstance(node, inkex.TextElement):
                _translate_x_y(node, t)
                for child in list(node):
                    if isinstance(child, inkex.Tspan) and translate_only:
                        _translate_x_y(child, t)
        if isinstance(node, inkex.Group):
            for child in list(node):
                self._flatten_translate(child)

    def _flatten_Transform(self, node):
        node.bake_transforms_recursively()
        return True

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._flatten_Transform(node)
                self._flatten_translate(node)


if __name__ == "__main__":
    FlattenTransform().run()
