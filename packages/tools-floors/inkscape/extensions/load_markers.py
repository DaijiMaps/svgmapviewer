#!/usr/bin/env python3
# coding=utf-8

import copy
import csv
import inkex
from lxml import etree
import os
import re



class LoadMarkers(inkex.EffectExtension):
    # (Assets)/(Markers)
    _assets = None
    _markers = None
    _markers_csv = None

    def _find_group(self, group):
        assert isinstance(self._markers, inkex.Group)
        for node in list(self._markers):
            if node.label == group:
                return node
        return None

    def _install_marker(self, v, node):
        g = inkex.Group()
        g.label = v['name'] # 'Triangle'
        g.append(node)
        prev = None
        assert isinstance(self._markers, inkex.Group)
        for node in list(self._markers):
            if node.label == v['name']:
                prev = node
        if prev is not None:
            self._markers.remove(prev)
        self._markers.append(g)
        node.set('id', v['name']) # 'Triangle'
        return True

    def _load_marker(self, v):
        svg_path = self.svg_path()
        assert isinstance(svg_path, str)
        file = os.path.join(svg_path, v['file'])
        f = inkex.load_svg(file)
        r = f.getroot()
        assert isinstance(r, inkex.SvgDocumentElement)
        node = r.getElementById(v['id'])
        return copy.deepcopy(node)

    def _handle_entry(self, v):
        # name,file,id
        if v['name'] == '':
            return False
        self.msg(f"- {v['name']}")
        if re.match('^#.*$', v['name']) is not None:
            return False
        node = self._load_marker(v)
        if node is None:
            return False
        self._install_marker(v, node)
        return True

    def _parse_markers_csv(self):
        svg_path = self.svg_path()
        assert isinstance(svg_path, str)
        self._markers_csv = os.path.join(svg_path, f"markers.csv")
        with open(self._markers_csv, "r", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            values = [line for line in reader]
            for v in values:
                self._handle_entry(v)

    def _find_assets_markers(self):
        assert isinstance(self._assets, inkex.Group)
        for child in list(self._assets):
            if isinstance(child, inkex.Group) and child.label == '(Markers)':
                self._markers = child

    def _find_assets(self):
        assert isinstance(self.document, inkex.SvgDocumentElement)
        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if isinstance(node.label, str)
                if re.match('^[(]Assets[)]$', node.label) is not None
        ]
        if len(res) != 1:
            return None
        else:
            return res[0]

    def _load_markers(self):
        self.msg(f"=== load markers: start")
        self._assets = self._find_assets()
        if self._assets is None:
            self.msg(f"(Assets) not found!")
            return False
        self._find_assets_markers()
        if self._markers is None:
            self.msg(f"(Assets)/(Markers) not found!")
            return False
        self._parse_markers_csv()
        self.msg(f"=== load markers: end")

    def _remove_defs_markers(self):
        for child in list(self.svg.defs):
            if isinstance(child, inkex.Marker):
                self.svg.defs.remove(child)

    def effect(self):
        self._remove_defs_markers()
        self._load_markers()


if __name__ == "__main__":
    LoadMarkers().run()
