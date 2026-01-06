#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import inkex
import json
import re
import os
from .visit_parents import (_visit_parents, CONT, SKIP)


class AddressTree(inkex.EffectExtension):
    _addresses = {}
    _all_addresses = {}
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

    _locs_json = None
    _addresses_json = None
    _coords_json = None
    _resolved_names_json = None
    _facilities_json = None

    _find_layers_opts = {
        'skip_ignoring': True
    }

    def _ignoring(self, node):
        return re.match(self._ignore_pattern, node.label) is not None

    def _visitor_node_branch(self, node, parents):
        pass

    def _visitor_node_leaf(self, node, parents):
        pass

    def _visitor(self, node, parents):
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

    def _find_layers(self):
        floor_pattern = self.options.floor

        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if not (node.label and (self._find_layers_opts['skip_ignoring'] and self._ignoring(node)))
                if (floor_pattern is None or re.match(floor_pattern, node.label) is not None)
        ]
        return res

    def _find_assets(self):
        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if not (node.label and self._ignoring(node))
                if re.match('^(Assets)$', node.label) is not None
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
                self._locs_json = os.path.join(self.svg_path(), "build", f"locs.json")

                # output
                self._addresses_json = os.path.join(self.svg_path(), "build", f"addresses_{self._layer_name}.json")
                #self._coords_json = os.path.join(self.svg_path(), "build", f"coords_{self._layer_name}.json")
                self._coords_json = os.path.join("/tmp", f"coords_{self._layer_name}.json")
                #self._resolved_names_json = os.path.join(self.svg_path(), f"build/resolved_names_{self._layer_name}.json")
                self._resolved_names_json = os.path.join("/tmp", f"resolved_names_{self._layer_name}.json")
                self._facilities_json = os.path.join(self.svg_path(), "build", f"facilities.json")

                # XXX reset all data per layer
                self._pre_collect_addresses(layer)
                self._collect_addresses(layer)
                self._post_collect_addresses(layer)
                self._pre_process_addresses(layer)
                self._process_addresses(layer)
                self._post_process_addresses(layer)
            self._post_layers()


class SaveAddresses(AddressTree):
    def _prefix_fixup(self, prefix):
        # XXX
        return re.sub(r'-Content-', '-', prefix)

    def _build_prefix(self, parents):
        plabels = [p.label for p in parents]
        # all parents MUST have a label!
        if None in plabels:
            return None
        prefix = "-".join(plabels)
        sep = "-" if prefix != "" else ""
        return self._prefix_fixup(f"{self._global_prefix}{prefix}{sep}")

    def _save_address(self, a, px, py, bb, href):
        p = (px, py)
        self._addresses[a] = (p, bb, href)
        self._all_addresses[a] = (p, bb, href)
        if p not in self._points:
            self._points[p] = []
        self._points[p].append(a)
        if p not in self._all_points:
            self._all_points[p] = []
        self._all_points[p].append(a)

    def _save_addresses(self, node, prefix, label):
        for child in list(node):
            # leaves MUST be <use> and define transform!
            a = f"{prefix}{label}-{child.label}"
            bb: inkex.BoundingBox = child.bounding_box()
            c = None
            (px, py) = (None, None)
            if isinstance(child, inkex.Use) and child.transform:
                (px, py) = (child.transform.e, child.transform.f)
            elif isinstance(child, inkex.Circle):
                c = child.center
            elif isinstance(child, inkex.Ellipse):
                c = child.center
            if c != None:
                (px, py) = (c.x, c.y)
                l = (bb.width + bb.height) * 0.5
                w = min(bb.width, l)
                dx = (w * 0.8 - bb.width) * 0.5
                bb = bb.resize(dx, 0)
            if px != None and py != None:
                self._save_address(a, px, py, bb, child.href)

    def _visitor_node_branch_save_address(self, node, parents):
        if node.label:
            prefix = self._build_prefix(parents)
            if prefix is not None:
                self._save_addresses(node, prefix, node.label)

    def _visitor_node_branch(self, node, parents):
        self._visitor_node_branch_save_address(node, parents)

    def _sort_children_by_label(self, node):
        children = {}
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
        with open(self._addresses_json, 'w') as f:
            j = {}
            for k, ((x, y), bb, href) in self._addresses.items():
                j[k] = {
                    'x': round(x, 3),
                    'y': round(y, 3),
                    'w': round(bb.width, 3),
                }
            json.dump(j, f)
        return super()._post_collect_addresses(node)

    def _collect_links(self):
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

    def _save_links(self):
        with open(self._facilities_json, 'w') as f:
            j = {
                'biLinks': self._links
            }
            json.dump(j, f)


class SaveAddressesWithLocs(SaveAddresses):
    # shop name => locs
    _locs = {}

    def _pre_process_addresses(self, layer):
        super()._pre_process_addresses(layer)
        with open(self._locs_json) as f:
            self._locs = json.load(f)


class GenerateAddresses(SaveAddressesWithLocs):
    _group_label = "(Addresses)"

    def _cleanup_addresses(self, layer):
        for child in list(layer):
            if child.label == self._group_label:
                child.delete()

    def _generate_addresses_address(self, aparent, k, x, y, bb, href):
        pass

    def _generate_addresses(self, layer):
        if len(self._addresses.items()) == 0:
            return

        aparent = inkex.Group()
        aparent.label = self._group_label
        for k, ((x, y), bb, href) in self._addresses.items():
            self._generate_addresses_address(aparent, k, x, y, bb, href)
        layer.append(aparent)

    def _pre_process_addresses(self, layer):
        super()._pre_process_addresses(layer)
        self._cleanup_addresses(layer)

    def _process_addresses(self, layer):
        super()._process_addresses(layer)
        self._generate_addresses(layer)
