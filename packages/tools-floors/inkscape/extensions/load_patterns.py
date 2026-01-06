#!/usr/bin/env python3
# coding=utf-8

import copy
import csv
import inkex
from lxml import etree
import os
import re



class LoadPatterns(inkex.EffectExtension):
    # (Assets)/(Patterns)
    _assets = None
    _patterns = None
    _patterns_csv = None

    def _find_group(self, group):
        for node in list(self._patterns):
            if node.label == group:
                return node
        return None

    def _install_pattern(self, v, node):
        prev = None
        for child in list(self._patterns):
            if child.get('id') == v['name']:
                prev = child
        if prev is not None:
            self._patterns.remove(prev)
        self._patterns.append(node)
        node.set('id', v['name']) # 'StairsH'
        return True

    def _load_pattern(self, v):
        file = os.path.join(self.svg_path(), v['file'])
        f = inkex.load_svg(file)
        r = f.getroot()
        node = r.getElementById(v['id'])
        return copy.deepcopy(node)

    def _handle_entry(self, v):
        # name,file,id
        if v['name'] == '':
            return False
        self.msg(f"- {v['name']}")
        if re.match('^#.*$', v['name']) is not None:
            return False
        node = self._load_pattern(v)
        if node is None:
            return False
        self._install_pattern(v, node)
        return True

    def _parse_patterns_csv(self):
        self._patterns_csv = os.path.join(self.svg_path(), f"patterns.csv")
        with open(self._patterns_csv, "r") as fh:
            reader = csv.DictReader(fh)
            values = [line for line in reader]
            for v in values:
                self._handle_entry(v)

    def _find_assets_patterns(self):
        for child in list(self._assets):
            if isinstance(child, inkex.Group) and child.label == '(Patterns)':
                self._patterns = child

    def _find_assets(self):
        res = [
            node for node in self.document.getroot()
                if isinstance(node, inkex.Group)
                if re.match('^[(]Assets[)]$', node.label) is not None
        ]
        if len(res) != 1:
            return None
        else:
            return res[0]

    def _load_patterns(self):
        self.msg(f"=== load patterns: start")
        self._assets = self._find_assets()
        if self._assets is None:
            self.msg(f"(Assets) not found!")
            return False
        self._find_assets_patterns()
        if self._patterns is None:
            self.msg(f"(Assets)/(Patterns) not found!")
            return False
        self._parse_patterns_csv()
        self.msg(f"=== load patterns: end")

    def _remove_defs_patterns(self):
        for child in list(self.svg.defs):
            if isinstance(child, inkex.Pattern):
                self.svg.defs.remove(child)

    def effect(self):
        self._remove_defs_patterns()
        self._load_patterns()


if __name__ == "__main__":
    LoadPatterns().run()
