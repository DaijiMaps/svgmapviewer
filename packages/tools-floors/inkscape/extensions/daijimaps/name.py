#!/usr/bin/env python3
# coding=utf-8

import inkex


def preferInt(n: float) -> float | int:
    r: float = round(n)
    return r if r == n else int(n)


def draw_label(text: str, size: float, x: float = 0, y: float = 0) -> inkex.TextElement:
    t = inkex.TextElement()
    t.label = text
    t.update(
        **{
            "font-family": "'Noto Sans'",
            # "-inkscape-font-specification": "'Noto Sans Ultra-Light'",
            "font-size": f"{size}",
            "font-weight": "200",
            "line-height": "1.5",
            "text-anchor": "middle",
            "text-align": "center",
            "writing-mode": "lr-tb",
            "direction": "ltr",
            "fill": "#000000",
            "stroke": "none",
        }
    )
    txts: list[str] = text.split()
    for txt in txts:
        ts = inkex.Tspan()
        ts.text = txt
        ts.update(
            **{
                "dy": 0,
                "sodipodi:role": "line",
            }
        )
        t.append(ts)
    return t


def draw_name(text: str, x: float = 0, y: float = 0) -> inkex.TextElement:
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
    t: inkex.TextElement, text: str, x: float = 0, y: float = 0
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


def remove_children_by_label(group: inkex.Group, label: str) -> inkex.Group | None:
    for child in group:
        if child.label == label:
            group.remove(child)
            return child
    return None


def move_name(
    old_group: inkex.Group,
    new_group: inkex.Group,
    old_name: str,
    new_name: str,
    x: float,
    y: float,
) -> inkex.Group | None:
    remove_children_by_label(new_group, new_name)
    child = remove_children_by_label(old_group, old_name)
    t = (
        draw_name(new_name, x, y)
        if child is None or not isinstance(child, inkex.TextElement)
        else redraw_name(child, new_name, x, y)
    )
    new_group.append(t)


type XY = tuple[float, float]
type Name = tuple[None | str, str, XY]


def read_name(node: inkex.BaseElement) -> None | Name:
    if not isinstance(node, inkex.TextElement):
        return None
    assert isinstance(node.label, str)
    name_and_address: list[str] = node.label.split(" @ ")
    name: str = name_and_address[0]
    if len(name_and_address) == 1:
        address = None
    else:
        address: str = name_and_address[1]

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


__all__ = [draw_label, draw_name, move_name, read_name, redraw_name]
