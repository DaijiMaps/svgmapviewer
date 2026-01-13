import json
import os
import re

import inkex

from .address_tree import AddressTree
from .common import xy2v
from .types import FacilitiesJson, TmpAddressCoords
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

    def _save_address(self, a, px, py, bb, href) -> None:
        self.msg(f"=== _save_address@SaveAddresses: {a} @ {px},{py}")
        p = (px, py)
        self._addresses[a] = (p, bb, href)
        self._all_addresses[a] = (p, bb, href)
        if p not in self._points:
            self._points[p] = []
        self._points[p].append(a)
        if p not in self._all_points:
            self._all_points[p] = []
        self._all_points[p].append(a)

    def _save_addresses(self, node, prefix, label) -> None:
        self.msg("=== _save_addresses@SaveAddresses")
        for child in list(node):
            # leaves MUST be <use> and define transform!
            a = f"{prefix}{label}-{child.label}"
            bb: inkex.BoundingBox = child.shape_box()
            c = None
            (px, py) = (None, None)
            (tx, ty) = (
                (child.transform.e, child.transform.f) if child.transform else (0, 0)
            )
            if isinstance(child, inkex.Use):
                x = child.get("x") or 0
                y = child.get("y") or 0
                (px, py) = (float(tx) + float(x), float(ty) + float(y))
            elif isinstance(child, inkex.Circle):
                c = child.center
            elif isinstance(child, inkex.Ellipse):
                c = child.center
            if c is not None:
                (px, py) = (float(tx) + float(c.x), float(ty) + float(c.y))
                hwh = (bb.width + bb.height) * 0.5
                w = min(bb.width, hwh)
                dx = (w * 0.8 - bb.width) * 0.5
                bb = bb.resize(dx, 0)
            if px is not None and py is not None:
                self._save_address(a, px, py, bb, child.href)

    def _visitor_node_branch_save_address(self, node: Tree, parents: Parents) -> None:
        self.msg("=== _visitor_node_branch_save_address@SaveAddresses")
        if node.label:
            prefix = self._build_prefix(parents)
            if prefix is not None:
                self._save_addresses(node, prefix, node.label)

    def _visitor_node_branch(self, node: Tree, parents: Parents) -> None:
        self.msg("=== _visitor_node_branch@SaveAddresses")
        self._visitor_node_branch_save_address(node, parents)

    def _sort_children_by_label(self, node: inkex.Group) -> None:
        self.msg("=== _sort_children_by_label@SaveAddresses")
        children: dict[str, list[inkex.BaseElement]] = {}
        for a in list(node):
            if a.label:
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

    def _post_collect_addresses(self, node):
        self.msg("=== _post_collect_addresses@SaveAddresses")
        assert isinstance(self._addresses_json, str)
        d = os.path.dirname(self._addresses_json)
        os.makedirs(d, exist_ok=True)
        with open(self._addresses_json, "w", encoding="utf-8") as f:
            j: TmpAddressCoords = {}
            for astr, ((x, y), _bb, _href) in self._addresses.items():
                j[astr] = xy2v(x, y)
            json.dump(j, f, indent=2)
        res = super()._post_collect_addresses(node)
        self.msg(f"=== _post_collect_addresses@SaveAddresses: {res}")
        return res

    def _collect_links(self) -> None:
        self.msg("=== _collect_links@SaveAddresses")
        n = 1
        for p in self._all_points:
            if len(p) == 1:
                continue
            xs = [a for a in self._all_points[p] if re.match("^.*-Facilities-.*$", a)]
            if len(xs) <= 1:
                continue
            # XXX check kind (e.g. Elevator, Stairs)
            # XXX don't hardcode
            xxs = [x for x in xs if re.match("^.*(Elevator|Stairs).*$", x)]
            if len(xxs) <= 1:
                continue
            self.msg(f"links: {p}: {self._all_points[p]}")
            self._links[str(n)] = xxs
            n = n + 1

    def _save_links(self) -> None:
        self.msg("=== _save_links@SaveAddresses")
        assert isinstance(self._facilities_json, str)
        d = os.path.dirname(self._facilities_json)
        os.makedirs(d, exist_ok=True)
        with open(self._facilities_json, "w", encoding="utf-8") as f:
            j: FacilitiesJson = {"biLinks": self._links}
            json.dump(j, f, indent=2)


__all__ = [SaveAddresses]  # type: ignore
