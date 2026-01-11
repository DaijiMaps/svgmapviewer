#!/usr/bin/env python3
# coding=utf-8

import inkex
from inkex.paths import (Move)



class LocSpan():
    text: str = ''
    fontSize: float
    dy: float

    def __init__(self, t, sz, dy):
        self.text = t
        self.fontSize = sz
        self.dy = dy


class LocName():
    text: str
    fontSize: float
    spans: list[LocSpan]

    def __init__(self, t, sz, ss):
        self.text = t
        self.fontSize = sz
        self.spans = ss


def draw_shop_name(text, x = 0, y = 0):
    t = inkex.TextElement()
    t.label = text
    t.update(**{
        "x": x,
        "y": y,
        "font-size": 2,
        "text-anchor": "middle",
    })
    ts = inkex.Tspan()
    ts.text = text
    ts.update(**{
        "x": x,
        "y": y,
        "font-size": 2,
        "text-anchor": "middle",
    })
    t.append(ts)
    return t


def read_shop_name(node: inkex.BaseElement):
    if (not isinstance(node, inkex.TextElement)):
        return None
    name_and_address = node.label.split(" @ ")
    name = name_and_address[0]
    if len(name_and_address) == 1:
        address = None
    else:
        address = name_and_address[1]
    (x, y) = (node.x, node.y) if isinstance(node, inkex.TextElement) else (0, 0)
    (tx, ty) = (node.transform.e, node.transform.f) if node.transform else (0, 0)
    return (address, name, (x + tx, y + ty))


def shop_to_relative(node: inkex.BaseElement):
    x = None
    y = None
    for child in list(node):
        if isinstance(child, inkex.TextElement):
            x = child.x
            y = child.y
    if None in [x, y]:
        return None
    node.transform = inkex.Transform(f"translate({x}, {y})")
    for child in list(node):
        if isinstance(child, inkex.TextElement):
            child.x = 0
            child.y = 0
            for ts in list(child):
                ts.x = ts.x - x
                ts.y = ts.y - y
        elif isinstance(child, inkex.PathElement):
            scale = float(child.get("stroke-width")) / 2
        else:
            return None


def draw_address(k: str, x: float, y: float, bb: inkex.BoundingBox, href: inkex.BaseElement):
    # XXX put texts above the target
    # XXX cause bbox calculation (text vs. bottom) is broken

    atspan1 = inkex.Tspan()
    atspan1.text = f"{k}"
    atspan1.set("font-size", "1.2px")
    atspan1.set("x", x)
    atspan1.set("y", f"{bb.top - 0.8 - 1.8}")

    atspan2 = inkex.Tspan()
    atspan2.text = f"{x}, {y}"
    atspan1.set("font-size", "1.2px")
    atspan2.set("x", x)
    atspan2.set("y", f"{bb.top - 0.8}")

    atext = inkex.TextElement()
    atext.label = f"{k}"
    atspan1.set("font-family", "sans-serif")
    atspan1.set("text-anchor", "middle")
    atext.append(atspan1)
    atext.append(atspan2)

    return atext
