#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import inkex
import inkex.command
import json
import re
import os
from typing import Union, TypedDict
from lxml import etree
from .visit_parents import (_visit_parents, CONT, SKIP, Visit, Tree, Parents, Visitor)
from .name import read_name, draw_name



type Url = str

type AddressPosEntry = tuple[XY, inkex.BoundingBox, Url]
type AddressPos = dict[AddressString, AddressPosEntry]

type AddressString = str
type NameString = str
type XY = tuple[float, float]

type Address = tuple[AddressString | None, XY]
type Addresses = list[Address]
type NameAddresses = dict[NameString, Addresses]

type Name = tuple[AddressString, XY]
type Names = list[Name]
type AddressNames = dict[AddressString, Names]

class V(TypedDict):
    x: float
    y: float
type TmpAddressCoords = dict[AddressString, V] # addresses.json
type TmpNameCoords = dict[NameString, list[V]] # tmp_unresolved_addresses.json
type TmpNameAddress = dict[NameString, list[AddressString]] # tmp_resolved_addresses.json

# XXX
class FacilitiesJson(TypedDict):
    biLinks: dict[str, list[AddressString]]


# XXX prefer 1 to 1.0
def unround(n: float) -> float:
    f = round(n, 3)
    i = round(f)
    return f if f != i else i

def xy2v(x, y) -> V:
    return {
        'x': unround(x),
        'y': unround(y),
        #'w': r3w if r3w != rw else rw,
    }

def a2v(axy: Address) -> V:
    (_a, (x, y)) = axy
    return xy2v(x, y)
    

class AddressTree(inkex.EffectExtension):
    _addresses: AddressPos = {}
    _all_addresses: AddressPos = {}
    _points = {}
    _all_points = {}
    _links = {}

    # XXX address <g> id
    # XXX (A)ddress
    # e.g. `A1F-Shops-1-1`
    _global_prefix = 'A'

    # e.g. `(Contents)`
    _ignore_pattern = '^[(].*[)]$'

    _layer_name = None

    #_locs_json = None
    _addresses_json = None
    _unresolved_names_json = None
    _resolved_names_json = None

    # XXX resolve-addresses input/output
    _tmp_unresolved_names_json = None
    _tmp_resolved_names_json = None

    _facilities_json = None

    _find_layers_opts = {
        'skip_ignoring': True
    }

    def _get_path(self, prefix, suffix) -> str | None:
        assert isinstance(self._layer_name, str)
        ps = [
            f"floors/{self._layer_name}/{prefix}.{suffix}",
            f"floors/{prefix}/{self._layer_name}.{suffix}",

            f"floors/{self._layer_name}-{prefix}.{suffix}",
            f"floors/{prefix}-{self._layer_name}.{suffix}",

            f"{self._layer_name}/{prefix}.{suffix}",
            f"{prefix}/{self._layer_name}.{suffix}",

            f"{self._layer_name}-{prefix}.{suffix}",
            f"{prefix}-{self._layer_name}.{suffix}",
        ]
        for p in ps:
            svg_path = self.svg_path()
            assert isinstance(svg_path, str)
            path = os.path.join(svg_path, p)
            self.msg(f"_get_path: {path}")
            if os.access(path, os.R_OK):
                self.msg(f"_get_path: found: {path}")
                return path
        self.msg(f"_get_path: not found: {prefix}, {suffix}")
        return None


    def _ignoring(self, node):
        return re.match(self._ignore_pattern, node.label) is not None

    def _visitor_node_branch(self, node: Tree, parents: Parents) -> None:
        pass

    def _visitor_node_leaf(self, node: Tree, parents: Parents) -> None:
        pass

    def _visitor(self, node: Tree, parents: Parents) -> Visit:
        if not isinstance(node, inkex.Group):
            return SKIP
        if node.label and self._ignoring(node):
            return SKIP

        # (T) Leaf (terminal) node?
        # leaves MUST be <use> and define transform!
        # XXX why `is not None` doesn't work?
        leaf = isinstance(node, inkex.Use) and node.transform

        if leaf:
            self._visitor_node_leaf(node, parents)
            return SKIP
        else:
            self._visitor_node_branch(node, parents)
            return CONT

    def _pre_collect_addresses(self, node):
        pass

    def _collect_addresses(self, node):
        self.msg(f"=== _collect_addresses@AddressTree")
        self._addresses = {}
        self._points = {}

        _visit_parents(node, self._visitor)

    def _post_collect_addresses(self, node):
        pass

    def _pre_process_addresses(self, node):
        pass

    def _process_addresses(self, node):
        pass

    def _post_process_addresses(self, node):
        pass

    def _pre_layers(self):
        pass

    def _post_layers(self):
        pass

    def _find_layers(self) -> list[inkex.Group]:
        self.msg(f"=== _find_layers")
        floor_pattern = self.options.floor

        assert isinstance(self.document, etree._ElementTree)
        assert isinstance(floor_pattern, Union[None, str])
        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if not (node.label and (self._find_layers_opts['skip_ignoring'] and self._ignoring(node)))
                if (floor_pattern is None or not isinstance(node.label, str) or re.match(floor_pattern, node.label) is not None)
        ]
        self.msg(f"=== _find_layers: {res}")
        return res

    def _find_assets(self) -> inkex.Group | None:
        assert isinstance(self.document, etree._ElementTree), f""
        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if not (node.label and self._ignoring(node))
                if isinstance(node.label, str) and re.match('^(Assets)$', node.label) is not None
        ]
        if len(res) != 1:
            return None
        else:
            return res[0]

    def add_arguments(self, pars: ArgumentParser) -> None:
        pars.add_argument("--tab", type=str, dest="tab")
        pars.add_argument("--floor", type=str, default=".")
        return super().add_arguments(pars)

    def effect(self):
        self.msg(f"==== AddressTree: start")
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._collect_addresses(node)
                self._process_addresses(node)
        else:
            self._pre_layers()
            for layer in self._find_layers():
                self._layer_name = layer.label

                # XXX set .json paths
                # input
                #self._locs_json = os.path.join(self.svg_path(), "build", f"locs_{self._layer_name}.json")
                #self._locs_json = os.path.join(self.svg_path(), f"locs.json")

                # output
                p = self.svg_path()
                assert isinstance(p, str)
                self._addresses_json = os.path.join(p, f"addresses/{self._layer_name}.json")
                self._unresolved_names_json = os.path.join(p, f"unresolved_names/{self._layer_name}.json")
                self._resolved_names_json = os.path.join(p, f"resolved_names/{self._layer_name}.json")
                #self._tmp_unresolved_names_json = os.path.join(self.svg_path(), "build", f"coords_{self._layer_name}.json")
                self._tmp_unresolved_names_json = os.path.join("/tmp", f"tmp_unresolved_names_{self._layer_name}.json")
                #self._tmp_resolved_names_json = os.path.join(self.svg_path(), f"build/resolved_names_{self._layer_name}.json")
                self._tmp_resolved_names_json = os.path.join("/tmp", f"tmp_resolved_names_{self._layer_name}.json")
                self._facilities_json = os.path.join(p, f"facilities.json")

                # XXX reset all data per layer
                self._pre_collect_addresses(layer)
                self._collect_addresses(layer)
                self._post_collect_addresses(layer)
                self._pre_process_addresses(layer)
                self._process_addresses(layer)
                self._post_process_addresses(layer)
            self._post_layers()
        self.msg(f"==== AddressTree: end")


class SaveAddresses(AddressTree):
    def _prefix_fixup(self, prefix: str) -> str:
        self.msg(f"=== _prefix_fixup@SaveAddresses")
        # XXX
        res = re.sub(r'-Content-', '-', prefix)
        self.msg(f"=== _prefix_fixup@SaveAddresses: {res}")
        return res

    def _build_prefix(self, parents: list[inkex.Group]) -> str | None:
        self.msg(f"=== _build_prefix@SaveAddresses")
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
        self.msg(f"=== _save_addresses@SaveAddresses")
        for child in list(node):
            # leaves MUST be <use> and define transform!
            a = f"{prefix}{label}-{child.label}"
            bb: inkex.BoundingBox = child.shape_box()
            c = None
            (px, py) = (None, None)
            (tx, ty) = (child.transform.e, child.transform.f) if child.transform else (0, 0)
            if isinstance(child, inkex.Use):
                x = child.get("x") or 0
                y = child.get("y") or 0
                (px, py) = (float(tx) + float(x), float(ty) + float(y))
            elif isinstance(child, inkex.Circle):
                c = child.center
            elif isinstance(child, inkex.Ellipse):
                c = child.center
            if c != None:
                (px, py) = (float(tx) + float(c.x), float(ty) + float(c.y))
                l = (bb.width + bb.height) * 0.5
                w = min(bb.width, l)
                dx = (w * 0.8 - bb.width) * 0.5
                bb = bb.resize(dx, 0)
            if px != None and py != None:
                self._save_address(a, px, py, bb, child.href)

    def _visitor_node_branch_save_address(self, node: Tree, parents: Parents) -> None:
        self.msg(f"=== _visitor_node_branch_save_address@SaveAddresses")
        if node.label:
            prefix = self._build_prefix(parents)
            if prefix is not None:
                self._save_addresses(node, prefix, node.label)

    def _visitor_node_branch(self, node: Tree, parents: Parents) -> None:
        self.msg(f"=== _visitor_node_branch@SaveAddresses")
        self._visitor_node_branch_save_address(node, parents)

    def _sort_children_by_label(self, node: inkex.Group) -> None:
        self.msg(f"=== _sort_children_by_label@SaveAddresses")
        children: dict[str, list[inkex.BaseElement]] = {}
        for a in list(node):
            if a.label:
                node.remove(a)
                # a.label looks like: "Sov. @ A4F-Shops-1-3"
                if a.label not in children:
                    children[a.label] = []
                children[a.label].append(a)
        # assume alphabetical order
        labels = sorted(children.keys(), key = lambda label: str.lower(label))
        for label in labels:
            for a in children[label]:
                node.append(a)

    def _post_collect_addresses(self, node):
        self.msg(f"=== _post_collect_addresses@SaveAddresses")
        assert isinstance(self._addresses_json, str)
        d = os.path.dirname(self._addresses_json)
        try:
            os.stat(d)
        except:
            os.mkdir(d)
        with open(self._addresses_json, 'w', encoding="utf-8") as f:
            j: TmpAddressCoords = {}
            for astr, ((x, y), _bb, _href) in self._addresses.items():
                j[astr] = xy2v(x, y)
            json.dump(j, f, indent=2)
        res = super()._post_collect_addresses(node)
        self.msg(f"=== _post_collect_addresses@SaveAddresses: {res}")
        return res

    def _collect_links(self) -> None:
        self.msg(f"=== _collect_links@SaveAddresses")
        n = 1
        for p in self._all_points:
            if len(p) == 1:
                continue
            xs = [
                a for a in self._all_points[p]
                    if re.match('^.*-Facilities-.*$', a)
            ]
            if len(xs) <= 1:
                continue
            # XXX check kind (e.g. Elevator, Stairs)
            # XXX don't hardcode
            xxs = [
                x for x in xs
                    if re.match('^.*(Elevator|Stairs).*$', x)
            ]
            if len(xxs) <= 1:
                continue
            self.msg(f"links: {p}: {self._all_points[p]}")
            self._links[str(n)] = xxs
            n = n + 1

    def _save_links(self) -> None:
        self.msg(f"=== _save_links@SaveAddresses")
        assert isinstance(self._facilities_json, str)
        d = os.path.dirname(self._facilities_json)
        try:
            os.stat(d)
        except:
            os.mkdir(d)
        with open(self._facilities_json, 'w', encoding="utf-8") as f:
            j: FacilitiesJson = {
                'biLinks': self._links
            }
            json.dump(j, f, indent=2)


class GenerateAddresses(SaveAddresses):
    _group_label = "(Addresses)"

    def _cleanup_addresses(self, layer) -> None:
        for child in list(layer):
            if child.label == self._group_label:
                child.delete()

    def _generate_addresses_address(self, aparent, k, x, y, bb, href) -> None:
        pass

    def _generate_addresses(self, layer) -> None:
        self.msg(f"=== GenerateAddresses: _generate_addresses")
        if len(self._addresses.items()) == 0:
            self.msg(f"_generate_addresses: no items found!")
            return

        aparent = inkex.Group()
        aparent.label = self._group_label
        for k, ((x, y), bb, href) in self._addresses.items():
            self._generate_addresses_address(aparent, k, x, y, bb, href)
        layer.append(aparent)

    def _pre_process_addresses(self, layer) -> None:
        super()._pre_process_addresses(layer)
        self._cleanup_addresses(layer)

    def _process_addresses(self, layer) -> None:
        self.msg(f"=== GenerateAddresses: _process_addresses")
        super()._process_addresses(layer)
        self._generate_addresses(layer)


class ResolveNames(SaveAddresses):
    _resolved_names: NameAddresses = {}
    _resolved_addresses: AddressNames = {}
    _unresolved_names: NameAddresses = {}
    _unresolved_addresses: AddressNames = {}
    _tmp_unresolved_name_coords: TmpNameCoords = {}
    _tmp_resolved_names: TmpNameAddress = {}

    def _exec_resolve(self) -> str:
        exe = '%s/../resolve-addresses' % os.path.dirname(__file__)
        return inkex.command.call(
            exe, self._addresses_json, self._tmp_unresolved_names_json, self._tmp_resolved_names_json)

    def _remove_children(self, node) -> None:
        for child in list(node):
            node.remove(child)

    def _read_names(self, node: inkex.Group) -> tuple[NameAddresses, AddressNames]:
        name_addresses: NameAddresses = {}
        address_names: AddressNames = {}
        for child in list(node):
            shop = read_name(child)
            if not shop:
                self.msg(f"loading (Names): {child.label}: failed")
                continue
            (address, name, xy) = shop
            # name -> (address, xy)
            # address can be None
            if name not in name_addresses:
                name_addresses[name] = []
            name_addresses[name].append((address, xy))
            # address -> (name, xy)
            # address must not be None
            if address is None:
                self.msg(f"skipping a resolved name without address: {name}")
                continue
            if address not in address_names:
                address_names[address] = []
            address_names[address].append((name, xy))

        return (name_addresses, address_names)

    def _read_resolved_names(self, node: inkex.Group) -> AddressNames:
        (name_addresses, address_names) = self._read_names(node)
        self._resolved_names = name_addresses
        self._resolved_addresses = address_names
        return address_names

    def _read_unresolved_names(self, node: inkex.Group) -> NameAddresses:
        (name_addresses, address_names) = self._read_names(node)
        self._unresolved_names = name_addresses
        self._unresolved_addresses = address_names
        return name_addresses

    def _load_tmp_resolved_names(self) -> None:
        assert self._tmp_resolved_names_json is not None, f"tmp resolved_names.json path is unspecified"
        with open(self._tmp_resolved_names_json, "r", encoding="utf-8") as f:
            # XXX
            # XXX
            # XXX
            # XXX validate
            self._tmp_resolved_names = json.load(f)
            # XXX
            # XXX
            # XXX

    def _save_resolved_names(self) -> None:
        self.msg(f"saving resolved names json: {self._resolved_names}")
        assert self._resolved_names_json is not None, f"_resolved_names_json path is unspecified"
        d = os.path.dirname(self._resolved_names_json)
        try:
            os.stat(d)
        except:
            os.makedirs(d)
        with open(self._resolved_names_json, 'w', encoding="utf-8") as f:
            json.dump(self._resolved_names, f, indent=2, ensure_ascii=False)

    def _save_unresolved_names(self) -> None:
        self.msg(f"saving unresolved names json: {self._unresolved_names}")
        assert self._unresolved_names_json is not None, f"_unresolved_names_json path is unspecified"
        d = os.path.dirname(self._unresolved_names_json)
        try:
            os.stat(d)
        except:
            os.makedirs(d)
        with open(self._unresolved_names_json, 'w', encoding="utf-8") as f:
            json.dump(self._unresolved_names, f, indent=2, ensure_ascii=False)

    def _save_tmp_unresolved_names(self) -> None:
        self.msg(f"saving tmp unresolved names json: {self._unresolved_names}")
        assert self._tmp_unresolved_names_json is not None, f"_tmp_unresolved_names_json path is unspecified"
        
        self._tmp_unresolved_name_coords = {}
        for name in self._unresolved_names:
            xys = list(map(a2v, self._unresolved_names[name]))
            self._tmp_unresolved_name_coords[name] = xys
        
        d = os.path.dirname(self._tmp_unresolved_names_json)
        try:
            os.stat(d)
        except:
            os.makedirs(d)
        with open(self._tmp_unresolved_names_json, 'w', encoding="utf-8") as f:
            json.dump(self._tmp_unresolved_name_coords, f, indent=2, ensure_ascii=False)

    def _find_group(self, layer, label) -> inkex.Group | None:
        for child in list(layer):
            self.msg(f"_find_group: {child.label}")
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            self.msg(f"_find_group: found: {child.label}")
            return child
        return None

    def _prepare_names_group(self, layer) -> inkex.Group | None:
        names_group = self._find_group(layer, '(Names)')
        self.msg(f"_process_addresses: names {names_group}")
        if names_group is not None:
            self._read_resolved_names(names_group)
        else:
            self._resolved_names = {}
        return names_group

    def _prepare_unresolved_names_group(self, layer) -> inkex.Group | None:
        unresolved_names_group = self._find_group(layer, '(Unresolved Names)')
        self.msg(f"_process_addresses: unresolved_names {unresolved_names_group}")
        if unresolved_names_group is not None:
            self._read_unresolved_names(unresolved_names_group)
        else:
            self._unresolved_names = {}
        return unresolved_names_group
