import json
import os
import re
from typing import Any, TypeGuard

import inkex

from .address_tree import AddressTree
from .common import xy2v
from .types import AddressCoords, AddressString, Box, FacilitiesJson, FloorsInfoJson, V
from .visit_parents import Tree, Parents


class SaveAddresses(AddressTree):
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
        p = (px, py)
        self._addresses[astr] = (p, bb, href)
        self._all_addresses[astr] = (p, bb, href)
        if p not in self._points:
            self._points[p] = []
        self._points[p].append(astr)
        if p not in self._all_points:
            self._all_points[p] = []
        self._all_points[p].append(astr)

    def _save_address1(self, node: inkex.BaseElement, prefix: str, label: str) -> None:
        astr = f"{prefix}{label}-{node.label}"
        bb: inkex.BoundingBox = node.shape_box()
        c: inkex.ImmutableVector2d | None = None
        p: inkex.ImmutableVector2d | None = None
        tx = node.composed_transform()
        if isUse(node):
            x = float(node.get("x") or 0)
            y = float(node.get("y") or 0)
            c = inkex.ImmutableVector2d(x, y)
        elif isCircle(node):
            c = node.center
        elif isEllipse(node):
            c = node.center
        if c is not None and bb is not None:
            p = tx.apply_to_point(c)
            hwh = (bb.width + bb.height) * 0.5
            w = min(bb.width, hwh)
            dx = (w * 0.8 - bb.width) * 0.5
            bb = bb.resize(dx, 0)
        if p is not None:
            self._save_address2(astr, p.x, p.y, bb, node.href)

    def _save_addresses(self, node: inkex.Group, prefix: str, label: str) -> None:
        self.msg("=== _save_addresses@SaveAddresses")
        for child in list(node):
            if not isinstance(child, inkex.BaseElement):
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
        for astr, ((x, y), _bb, _href) in self._addresses.items():
            j[astr] = xy2v(x, y)
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
        for p in self._all_points:
            if len(p) == 1:
                continue
            xs: list[AddressString] = [
                a for a in self._all_points[p] if re.match("^.*-Facilities-.*$", a)
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
            self.msg(f"links: {p}: {self._all_points[p]}")
            self._links[str(n)] = xxs
            n = n + 1

    def _save_links(self) -> None:
        self.msg("=== _save_links@SaveAddresses")
        j: FacilitiesJson = {"biLinks": self._links}

        p = self._facilities_json
        assert isinstance(p, str)
        makedirsAndDump(p, dict(j))


def makedirsAndDump(p: str, j: dict) -> None:
    d = os.path.dirname(p)
    os.makedirs(d, exist_ok=True)
    with open(p, mode="w", encoding="utf-8") as f:
        json.dump(j, f, indent=2, ensure_ascii=False)


def isRectangle(x: Any) -> TypeGuard[inkex.Rectangle]:
    return isinstance(x, inkex.Rectangle)


def isCircle(x: Any) -> TypeGuard[inkex.Circle]:
    return isinstance(x, inkex.Circle)


def isEllipse(x: Any) -> TypeGuard[inkex.Ellipse]:
    return isinstance(x, inkex.Ellipse)


def isUse(x: Any) -> TypeGuard[inkex.Use]:
    return isinstance(x, inkex.Use)


def isGroup(x: Any) -> TypeGuard[inkex.Group]:
    return isinstance(x, inkex.Group)


__all__ = [SaveAddresses]
