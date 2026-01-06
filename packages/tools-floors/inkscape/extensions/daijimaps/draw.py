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


# k == None
# relative (transform)
def put_shop(k, x, y, bb, href: inkex.BaseElement, locs):
    scale = bb.width / 150.0 # px

    g = inkex.Group()
    label = f"{locs['text']} @ {k}" if k else f"{locs['text']}"
    g.label = label
    g.transform = inkex.Transform(f"translate({x}, {y})")

    # XXX bb.height is broken
    s = inkex.Transform(f"scale({scale}, {scale})")

    pd = inkex.Path("m-75,-50 h150 v100 h-150 z")
    pd = pd.transform(s).to_relative()

    p = inkex.PathElement()
    p.update(**{
        "stroke-width": f"{2 * scale}",
        "stroke": "black",
        "fill": "none",
        "d": f"M0,0 {pd}"
    })
    g.append(p)

    t = inkex.TextElement()
    t.label = locs["text"]
    t.update(**{
        "x": 0,
        "y": 0,
        "font-size": locs["fontSize"] * scale,
    })

    for line in locs["lines"]:
        d = Move(0, line["dy"])
        d = d.transform(s)

        ts = inkex.Tspan()
        ts.text = line["text"]
        ts.update(**{
            "x": 0 + d.x,
            "y": 0 + d.y,
            "font-size": line["fontSize"] * scale,
            "font-family": "Avenir",
            "text-anchor": "middle",
        })

        t.append(ts)

    g.append(t)

    return g


# href: a <use> element as a reference
# locname: LocName
def draw_shop(k, x, y, bb, href: inkex.BaseElement, locs):
    scale = bb.width / 150.0 # px
    return draw_shop2(k, x, y, scale, href, locs)

def draw_shop2(k, x, y, scale, href: inkex.BaseElement, locs):
    g = inkex.Group()
    label = f"{locs['text']} @ {k}" if k else f"{locs['text']}"
    g.label = label

    # XXX bb.height is broken
    s = inkex.Transform(f"scale({scale}, {scale})")

    pd = inkex.Path("m-75,-50 h150 v100 h-150 z")
    pd = pd.transform(s).to_relative()

    p = inkex.PathElement()
    p.update(**{
        "stroke-width": f"{2 * scale}",
        "stroke": "black",
        "fill": "none",
        "d": f"M{x},{y} {pd}"
    })
    g.append(p)

    t = inkex.TextElement()
    t.label = locs["text"]
    t.update(**{
        "x": x,
        "y": y,
        "font-size": locs["fontSize"] * scale,
    })

    for line in locs["lines"]:
        d = Move(0, line["dy"])
        d = d.transform(s)

        ts = inkex.Tspan()
        ts.text = line["text"]
        ts.update(**{
            "x": x + d.x,
            "y": y + d.y,
            "font-size": line["fontSize"] * scale,
            "font-family": "Avenir",
            "text-anchor": "middle",
        })

        t.append(ts)

    g.append(t)

    return g


def read_shop(node: inkex.BaseElement):
    if (not isinstance(node, inkex.Group)):
        return None
    name_and_address = node.label.split(" @ ")
    name = name_and_address[0]
    if len(name_and_address) == 1:
        address = None
    else:
        address = name_and_address[1]
    (tx, ty) = (node.transform.e, node.transform.f) if node.transform else (None, None)
    scale = None
    for child in list(node):
        if isinstance(child, inkex.TextElement):
            ax = child.x
            ay = child.y
            pass
        elif isinstance(child, inkex.PathElement):
            scale = float(child.get("stroke-width")) / 2
        else:
            return None
    (x, y) = (ax, ay) # if ax != None and ay != None else (tx, ty)
    #if None in [name, x, y, scale]:
    #    return None
    #locs["fontSize"] = node.get("font-size")
    #locs = {}
    #locs["text"] = name
    return (address, name, (tx, ty), (ax, ay), scale)


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
