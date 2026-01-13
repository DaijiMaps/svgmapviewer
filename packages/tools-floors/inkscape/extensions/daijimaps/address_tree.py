#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import inkex
import re
import os
from lxml import etree
from .visit_parents import _visit_parents, CONT, SKIP, Visit, Tree, Parents
from .types import AddressPos


class AddressTree(inkex.EffectExtension):
    _addresses: AddressPos = {}
    _all_addresses: AddressPos = {}
    _points = {}
    _all_points = {}
    _links = {}

    # XXX address <g> id
    # XXX (A)ddress
    # e.g. `A1F-Shops-1-1`
    _global_prefix = "A"

    # e.g. `(Contents)`
    _ignore_pattern = "^[(].*[)]$"

    _layer_name = None

    # _locs_json = None
    _addresses_json = None
    _unresolved_names_json = None
    _resolved_names_json = None

    # XXX resolve-addresses input/output
    _tmp_unresolved_names_json = None
    _tmp_resolved_names_json = None

    # XXX resolve-addresses input/output
    _floors_addresses_json: str | None = None
    _floors_names_json: str | None = None

    _facilities_json = None

    _find_layers_opts = {"skip_ignoring": True}

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
        self.msg("=== _collect_addresses@AddressTree")
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
        self.msg("=== _find_layers")
        floor_pattern = self.options.floor

        assert isinstance(self.document, etree._ElementTree)
        assert isinstance(floor_pattern, str | None)
        res = [
            node
            for node in self.document.getroot()
            if isinstance(node, inkex.Group)
            if not (
                node.label
                and (self._find_layers_opts["skip_ignoring"] and self._ignoring(node))
            )
            if (
                floor_pattern is None
                or not isinstance(node.label, str)
                or re.match(floor_pattern, node.label) is not None
            )
        ]
        self.msg(f"=== _find_layers: {res}")
        return res

    def _find_assets(self) -> inkex.Group | None:
        assert isinstance(self.document, etree._ElementTree), ""
        res = [
            node
            for node in self.document.getroot()
            if isinstance(node, inkex.Group)
            if not (node.label and self._ignoring(node))
            if isinstance(node.label, str)
            and re.match("^(Assets)$", node.label) is not None
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
        self.msg("==== AddressTree: start")
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
                # self._locs_json = os.path.join(self.svg_path(), "build", f"locs_{self._layer_name}.json")
                # self._locs_json = os.path.join(self.svg_path(), f"locs.json")

                # output
                p = self.svg_path()
                assert isinstance(p, str)
                self._addresses_json = os.path.join(
                    p, f"addresses/{self._layer_name}.json"
                )
                self._unresolved_names_json = os.path.join(
                    p, f"unresolved_names/{self._layer_name}.json"
                )
                self._resolved_names_json = os.path.join(
                    p, f"resolved_names/{self._layer_name}.json"
                )
                # self._tmp_unresolved_names_json = os.path.join(self.svg_path(), "build", f"coords_{self._layer_name}.json")
                self._tmp_unresolved_names_json = os.path.join(
                    "/tmp", f"tmp_unresolved_names_{self._layer_name}.json"
                )
                # self._tmp_resolved_names_json = os.path.join(self.svg_path(), f"build/resolved_names_{self._layer_name}.json")
                self._tmp_resolved_names_json = os.path.join(
                    "/tmp", f"tmp_resolved_names_{self._layer_name}.json"
                )
                self._facilities_json = os.path.join(p, "facilities.json")
                self._floors_addresses_json = os.path.join(
                    p, f"floors-addresses-{self._layer_name}.json"
                )
                self._floors_names_json = os.path.join(
                    p, f"floors-names-{self._layer_name}.json"
                )

                # XXX reset all data per layer
                self._pre_collect_addresses(layer)
                self._collect_addresses(layer)
                self._post_collect_addresses(layer)
                self._pre_process_addresses(layer)
                self._process_addresses(layer)
                self._post_process_addresses(layer)
            self._post_layers()
        self.msg("==== AddressTree: end")


__all__ = [
    AddressTree,
]  # type: ignore
