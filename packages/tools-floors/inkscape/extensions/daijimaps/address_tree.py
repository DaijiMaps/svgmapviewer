#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import inkex
import re
import os
from lxml import etree
from .visit_parents import _visit_parents, CONT, SKIP, Visit, Tree, Parents
from .types import AddressPos, JsonGlobalPaths, JsonLayerPaths, Links, PosAddress


class AddressTree(inkex.EffectExtension):
    _addresses: AddressPos = {}
    _all_addresses: AddressPos = {}
    _points: PosAddress = {}
    _all_points: PosAddress = {}
    _links: Links = {}

    # XXX address <g> id
    # XXX (A)ddress
    # e.g. `A1F-Shops-1-1`
    _global_prefix = "A"

    # e.g. `(Contents)`
    _ignore_pattern = "^[(].*[)]$"

    # _layer_name: str | None = None

    _layerPaths: JsonLayerPaths
    _paths: JsonGlobalPaths

    _facilities_json: str | None = None

    _find_layers_opts = {"skip_ignoring": True}

    def _get_path(self, layer_name: str, prefix: str, suffix: str) -> str | None:
        assert isinstance(layer_name, str)
        ps = [
            f"floors/{layer_name}/{prefix}.{suffix}",
            f"floors/{prefix}/{layer_name}.{suffix}",
            f"floors/{layer_name}-{prefix}.{suffix}",
            f"floors/{prefix}-{layer_name}.{suffix}",
            f"{layer_name}/{prefix}.{suffix}",
            f"{prefix}/{layer_name}.{suffix}",
            f"{layer_name}-{prefix}.{suffix}",
            f"{prefix}-{layer_name}.{suffix}",
        ]
        svg_path: str = self.svg_path()
        assert isinstance(svg_path, str)
        for p in ps:
            path: str = os.path.join(svg_path, p)
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

    def _pre_collect_addresses(self, node) -> None:
        pass

    def _collect_addresses(self, node) -> None:
        self.msg("=== _collect_addresses@AddressTree")
        self._addresses = {}
        self._points = {}

        _visit_parents(node, self._visitor)

    def _post_collect_addresses(self, node: inkex.Group) -> None:
        pass

    def _pre_process_addresses(self, node: inkex.Group) -> None:
        pass

    def _process_addresses(self, node: inkex.Group) -> None:
        pass

    def _post_process_addresses(self, node: inkex.Group) -> None:
        pass

    def _pre_layers(self) -> None:
        pass

    def _post_layers(self) -> None:
        pass

    def _find_layers(self) -> list[inkex.Group]:
        self.msg("=== _find_layers")
        floor_pattern: str = self.options.floor

        assert isinstance(self.document, etree._ElementTree)
        assert isinstance(floor_pattern, str | None)
        res: list[inkex.Group] = [
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
        res: list[inkex.Group] = [
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

    def _set_paths(self, layer_name: str):
        p = self.svg_path()
        assert isinstance(p, str)

        j = os.path.join
        ln = layer_name

        self._layerPaths = {
            "addresses": j(p, f"addresses/{ln}.json"),
            "unresolvedNames": j(p, f"unresolved_names/{ln}.json"),
            "resolvedNames": j(p, f"resolved_names/{ln}.json"),
            "tmpUnresolvedNames": j("/tmp", f"tmp_unresolved_names_{ln}.json"),
            "tmpResolvedNames": j("/tmp", f"tmp_resolved_names_{ln}.json"),
            "floorsAddresses": j(p, f"floors-addresses-{ln}.json"),
            "floorsNames": j(p, f"floors-names-{ln}.json"),
        }
        self._paths = {"facilities": j(p, "facilities.json")}

    def _handle_layer(self, layer: inkex.Group, layer_name: str) -> None:
        # XXX set .json paths
        # input
        # self._locs_json = os.path.join(self.svg_path(), "build", f"locs_{layer_name}.json")
        # self._locs_json = os.path.join(self.svg_path(), f"locs.json")

        self._set_paths(layer_name)

        self._pre_collect_addresses(layer)
        self._collect_addresses(layer)
        self._post_collect_addresses(layer)
        self._pre_process_addresses(layer)
        self._process_addresses(layer)
        self._post_process_addresses(layer)

    def add_arguments(self, pars: ArgumentParser) -> None:
        pars.add_argument("--tab", type=str, dest="tab")
        pars.add_argument("--floor", type=str, default=".")
        return super().add_arguments(pars)

    def effect(self) -> None:
        self.msg("==== AddressTree: start")
        self._pre_layers()
        for layer in self._find_layers():
            layer_name = layer.label
            if not isinstance(layer_name, str):
                continue
            self._handle_layer(layer, layer_name)
        self._post_layers()
        self.msg("==== AddressTree: end")


__all__ = [
    AddressTree,
]
