#!/usr/bin/env python3
# coding=utf-8

from lxml import etree

import inkex


def preferInt(n: float) -> float | int:
    r = round(n)
    return r if r == n else n


def draw_name(text, x: float = 0, y: float = 0) -> inkex.TextElement:
    t = inkex.TextElement()
    t.label = text
    t.update(
        **{
            "x": round(x),
            "y": round(y),
            "font-size": "2px",
            "text-anchor": "middle",
        }
    )
    ts = inkex.Tspan()
    ts.text = text
    t.append(ts)
    return t


def redraw_name(
    t: inkex.TextElement, text, x: float = 0, y: float = 0
) -> inkex.TextElement:
    t.label = text
    t.update(
        **{
            "x": round(x),
            "y": round(y),
            "font-size": "2px",
            "text-anchor": "middle",
        }
    )
    first = None
    for ts in t:
        if first is None:
            first = ts
        else:
            t.remove(ts)
    if first is not None:
        first.text = text
    else:
        ts = inkex.Tspan()
        ts.text = text
        t.append(ts)
    return t


type XY = tuple[float, float]
type Name = tuple[None | str, str, XY]


def read_name(node: inkex.BaseElement) -> None | Name:
    if not isinstance(node, inkex.TextElement):
        return None
    assert isinstance(node.label, str)
    name_and_address = node.label.split(" @ ")
    name = name_and_address[0]
    if len(name_and_address) == 1:
        address = None
    else:
        address = name_and_address[1]

    # check "unmoved" node (x == 0 and y == 0 and transform is None)
    (x, y) = (node.x, node.y)
    tx = node.transform
    p = (
        inkex.Vector2d(0, 0)
        if (x == 0 and y == 0 and tx is None)
        else inkex.Vector2d(x, y)
        if tx is None
        else tx.apply_to_point(inkex.Vector2d(x, y))
    )
    return (address, name, (round(p.x), round(p.y)))


__all__ = [draw_name, read_name, redraw_name]  # type: ignore
