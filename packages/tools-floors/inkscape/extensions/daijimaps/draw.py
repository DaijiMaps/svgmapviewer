#!/usr/bin/env python3
# coding=utf-8

import inkex
from inkex.paths import (Move)



def preferInt(n):
    r = round(n)
    return r if r == n else n



def draw_name(text, x = 0, y = 0):
    t = inkex.TextElement()
    t.label = text
    t.update(**{
        "x": preferInt(x),
        "y": preferInt(y),
        "font-size": 2,
        "text-anchor": "middle",
    })
    ts = inkex.Tspan()
    ts.text = text
    ts.update(**{
        "x": preferInt(x),
        "y": preferInt(y),
        "font-size": 2,
        "text-anchor": "middle",
    })
    t.append(ts)
    return t


def read_name(node: inkex.BaseElement):
    if (not isinstance(node, inkex.TextElement)):
        return None
    assert isinstance(node.label, str)
    name_and_address = node.label.split(" @ ")
    name = name_and_address[0]
    if len(name_and_address) == 1:
        address = None
    else:
        address = name_and_address[1]
    (x, y) = (node.x, node.y) if isinstance(node, inkex.TextElement) else (0, 0)
    (tx, ty) = (node.transform.e, node.transform.f) if node.transform else (0, 0)
    return (address, name, (x + tx, y + ty))
