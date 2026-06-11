import json
import math
import os
import re
from typing import Any

import inkex

from .address_tree import AddressTree
from .area import calc_area
from .common import xy2v
from .guards import isCircle, isEllipse, isGroup, isRectangle, isUse
from .types import (
    AddressCoords,
    AddressProps,
    AddressString,
    Box,
    FacilitiesJson,
    FloorsInfoJson,
    V,
    XY,
)
from .visit_parents import Tree, Parents


class SaveAddresses(AddressTree):
    def area(self) -> None | float:
        # use
        # circle / ellipse
        return 0

    def _reset(self) -> None:
        super()._reset()

    def _prefix_fixup(self, prefix: str) -> str:
        self.msg("=== _prefix_fixup@SaveAddresses")
        # XXX
        res = re.sub(r"-Content-", "-", prefix)
        self.msg(f"=== _prefix_fixup@SaveAddresses: {res}")
        return res

    def _build_prefix(self, parents: list[inkex.Group]) -> str | None:
        self.msg("=== _build_prefix@SaveAddresses")
        plabels = [p.label for p in parents if isinstance(p.label, str)]
        # all parents MUST have a label!
        if None in plabels:
            return None
        prefix = "-".join(plabels)
        sep = "-" if prefix != "" else ""
        res = self._prefix_fixup(f"{self._global_prefix}{prefix}{sep}")
        self.msg(f"=== _build_prefix@SaveAddresses: {res}")
        return res

    def _save_address2(self, astr: AddressString, px, py, bb, href) -> None:
        self.msg(f"=== _save_address@SaveAddresses: {astr} @ {px},{py}")
        p: V = {
            "x": px,
            "y": py,
            "area": None,
            "rx": None,
            "ry": None,
            "rotate": None,
        }
        self._addresses[astr] = (p, bb, href)
        self._all_addresses[astr] = (p, bb, href)

        xy: XY = (px, py)
        if xy not in self._points:
            self._points[xy] = []
        self._points[xy].append(astr)
        if xy not in self._all_points:
            self._all_points[xy] = []
        self._all_points[xy].append(astr)

    def _save_address_area(
        self, astr: AddressString, a: float, rx: float, ry: float
    ) -> None:
        p: AddressProps = {
            "area": a,
            "rx": float(rx),
            "ry": float(ry),
            "rotate": None,
        }
        self._address_areas[astr] = p
        self._all_address_areas[astr] = p

    def _save_address1(self, node: inkex.BaseElement, prefix: str, label: str) -> None:
        astr = f"{prefix}{label}-{node.label}"
        bb: inkex.BoundingBox = node.shape_box()
        c: inkex.ImmutableVector2d | None = None
        p: inkex.ImmutableVector2d | None = None
        a: float | None = None
        rx: float | None = None
        ry: float | None = None
        tx = node.composed_transform()
        if isUse(node):
            x = float(node.get("x") or 0)
            y = float(node.get("y") or 0)
            c = inkex.ImmutableVector2d(x, y)
            (a, rx, ry) = calc_area(node)
        elif isCircle(node):
            c = node.center
            (a, rx, ry) = calc_area(node)
        elif isEllipse(node):
            c = node.center
            (a, rx, ry) = calc_area(node)
        if c is not None and bb is not None:
            p = tx.apply_to_point(c)
            hwh = (bb.width + bb.height) * 0.5
            w = min(bb.width, hwh)
            dx = (w * 0.8 - bb.width) * 0.5
            bb = bb.resize(dx, 0)
        self.msg(f"=== _save_address1: {astr} p={p} a={a} rx={rx} ry={ry}")
        if p is not None:
            self._save_address2(astr, p.x, p.y, bb, node.href)
            if a is not None and rx is not None and ry is not None:
                self._save_address_area(astr, a, rx, ry)

    def _save_addresses(self, node: inkex.Group, prefix: str, label: str) -> None:
        self.msg("=== _save_addresses@SaveAddresses")
        for child in list(node):
            if not isinstance(child, inkex.BaseElement):
                continue
            if label is None or child.label is None:
                continue
            self._save_address1(child, prefix, label)

    def _visitor_node_branch_save_address(self, node: Tree, parents: Parents) -> None:
        self.msg("=== _visitor_node_branch_save_address@SaveAddresses")
        if node.label:
            prefix = self._build_prefix(parents)
            if prefix is not None:
                self._save_addresses(node, prefix, node.label)

    def _visitor_node_branch(self, node: Tree, parents: Parents) -> None:
        self.msg("=== _visitor_node_branch@SaveAddresses")
        self._visitor_node_branch_save_address(node, parents)

    def _sort_children(self, node: inkex.Group) -> None:
        self.msg("=== _sort_children@SaveAddresses")
        children: dict[str, list[inkex.BaseElement]] = {}
        for a in list(node):
            if isinstance(a, inkex.Group) and a.label:
                node.remove(a)
                # a.label looks like: "Sov. @ A4F-Shops-1-3"
                if a.label not in children:
                    children[a.label] = []
                children[a.label].append(a)
        # assume alphabetical order
        labels = sorted(children.keys(), key=lambda label: str.lower(label))
        for label in labels:
            for a in children[label]:
                node.append(a)

    def _get_addresses_coords(self) -> AddressCoords:
        j: AddressCoords = {}
        for astr, (v, _bb, _href) in self._addresses.items():
            if astr in self._all_address_areas:
                p = self._all_address_areas[astr]
                area = p["area"]
                rx: float | None = p["rx"]
                ry: float | None = p["ry"]
                if area is not None:
                    v["area"] = round(area, 2)
                if rx is not None:
                    v["rx"] = round(rx, 2)
                if ry is not None:
                    v["ry"] = round(ry, 2)
                v["rotate"] = None
            j[astr] = v
        return j

    def _get_origin(self) -> V | None:
        origins: Any = self.svg.xpath(
            '//*[@*[name()="inkscape:label"]="(Assets)"]/*[@*[name()="inkscape:label"]="(Origin)"]'
        )
        if not isinstance(origins, list) or len(origins) != 1:
            self.msg("_get_origin: not found!")
            return None
        origin = list(origins)[0]
        if not isCircle(origin):
            self.msg("_get_origin: not circle!")
            return None
        c: inkex.ImmutableVector2d = origin.center
        j: V = {
            "x": c.x,
            "y": c.y,
            "area": None,
            "rx": None,
            "ry": None,
            "rotate": None,
        }
        return j

    def _get_viewbox(self, name="(ViewBox)") -> Box | None:
        viewboxes: Any = self.svg.xpath(
            f'//*[@*[name()="inkscape:label"]="(Assets)"]/*[@*[name()="inkscape:label"]="{name}"]'
        )
        if not isinstance(viewboxes, list) or len(viewboxes) != 1:
            self.msg(f"_get_viewbox: not found! (name={name})")
            return None
        viewbox = list(viewboxes)[0]
        if not isRectangle(viewbox):
            self.msg(f"_get_viewbox: not rectangle! (name={name})")
            return None
        j: Box = {
            "x": viewbox.left,
            "y": viewbox.top,
            "width": viewbox.width,
            "height": viewbox.height,
        }
        return j

    def _get_bbox(self):
        return self._get_viewbox(name="(BoundingBox)")

    def _get_floor(self, e: Any) -> tuple[str, FloorsInfoJson] | None:
        if not isGroup(e):
            self.msg(f"_get_floors: not group! ({e})")
            return None
        label = e.label
        if label is None:
            self.msg(f"_get_floors: no label! ({e})")
            return None
        # find 'Content'
        subelems = e.xpath("./*[@*[name()='inkscape:label']='Content']")
        if not isinstance(subelems, list) or len(subelems) != 1:
            self.msg(f"_get_floors: not found! {subelems}")
            return None
        content = subelems[0]
        if not isGroup(content):
            self.msg(f"_get_floors: not group! ({content})")
            return None
        id = content.get_id()
        return (
            label,
            {
                "contentId": id,
            },
        )

    def _get_floors(self) -> dict[str, FloorsInfoJson] | None:
        elems: Any = self.svg.xpath("/*/*[@*[name()='inkscape:groupmode']='layer']")
        if not isinstance(elems, list):
            self.msg(f"_get_floors: not found! {elems}")
            return None
        layers: dict[str, FloorsInfoJson] = {}
        for e in elems:
            res = self._get_floor(e)
            if res is None:
                continue
            (label, info) = res
            layers[label] = info
        return layers

    def _save_addresses_coords(self, node):
        j: AddressCoords = self._get_addresses_coords()
        p = self._layerPaths["addresses"]
        makedirsAndDump(p, j)

    def _save_origin(self):
        j: V | None = self._get_origin()
        if j is None:
            return
        p = self._paths["origin"]
        makedirsAndDump(p, dict(j))

    def _save_viewbox(self):
        j: Box | None = self._get_viewbox()
        if j is None:
            return
        p = self._paths["viewbox"]
        makedirsAndDump(p, dict(j))

    def _save_bbox(self):
        j: Box | None = self._get_bbox()
        if j is None:
            return
        p = self._paths["bbox"]
        makedirsAndDump(p, dict(j))

    def _save_floors(self):
        j: dict[str, FloorsInfoJson] | None = self._get_floors()
        if j is None:
            return
        p = self._paths["floors"]
        makedirsAndDump(p, dict(j))

    def _post_collect_addresses(self, node):
        self.msg("=== _post_collect_addresses@SaveAddresses")

        self._save_addresses_coords(node)
        self._save_origin()
        self._save_viewbox()
        self._save_bbox()
        self._save_floors()

        self.msg("=== _post_collect_addresses@SaveAddresses")

    def _collect_links(self) -> None:
        self.msg("=== _collect_links@SaveAddresses")
        n = 1
        for xy in self._all_points:
            if len(xy) == 1:
                continue
            xs: list[AddressString] = [
                a for a in self._all_points[xy] if re.match("^.*-Facilities-.*$", a)
            ]
            if len(xs) <= 1:
                continue
            # XXX check kind (e.g. Elevator, Stairs)
            # XXX don't hardcode
            xxs: list[AddressString] = [
                x for x in xs if re.match("^.*(Elevator|Stairs).*$", x)
            ]
            if len(xxs) <= 1:
                continue
            self.msg(f"links: {xy}: {self._all_points[xy]}")
            self._links[str(n)] = xxs
            n = n + 1

    def _save_links(self) -> None:
        self.msg("=== _save_links@SaveAddresses")
        j: FacilitiesJson = {"biLinks": self._links}

        p = self._paths["facilities"]
        assert isinstance(p, str)
        makedirsAndDump(p, dict(j))


def makedirsAndDump(p: str, j: dict) -> None:
    d = os.path.dirname(p)
    os.makedirs(d, exist_ok=True)
    with open(p, mode="w", encoding="utf-8") as f:
        json.dump(j, f, indent=2, ensure_ascii=False)


__all__ = [SaveAddresses]
