#!/usr/bin/env python3
# coding=utf-8

import csv
import inkex
from lxml import etree
import os
import re



class LoadSymbols(inkex.EffectExtension):
    # (Assets)/(Symbols)
    _assets = None
    _symbols = None
    _symbols_csv = None

    def _find_group(self, group):
        for node in list(self._symbols):
            if node.label == group:
                return node
        return None

    def _install_symbol(self, v, node):
        g = self._find_group(v['group'])
        if g is None:
            g = inkex.Group()
            g.label = v['group'] # '(Facilities)'
            self._symbols.append(g)
        s = inkex.Group()
        s.label = v['name'] # 'Toilets'
        x = inkex.Group()
        x.label = "X" + v['name'] # 'XToilets'
        x.set('id', x.label) # 'XToilets'
        x.set('transform', f"scale({v['scale']}) translate({v['dx']}, {v['dy']})")
        for c in list(node):
            x.append(c)
        s.append(x)
        prev = None
        for node in list(g):
            if node.label == v['name']:
                prev = node
        g.append(s)
        if prev is not None:
            g.remove(prev)
        return True

    # AigaSymbols.svg#Elevator_Inv defines '#person2' (and uses it)
    # Rename '#person2' to '#_person2' so it will not be trimmed
    # by map-extract-floors.py:fixupElement()
    def _fixup_symbol_ids(self, tree):
        if tree is None:
            return
        href_ids = {}
        for e in tree.iter():
            href = e.get('href') or e.get('xlink:href')
            if href is not None:
                href_id = re.sub(r'#', '', href)
                href_ids[href_id] = True
        for e in tree.iter():
            _id = e.get('id')
            if _id in href_ids:
                self.msg(f"fixing id: {_id} -> _{_id}")
                e.set('id', f"_{_id}")
            href = e.get('xlink:href')
            if href is not None:
                href_id = re.sub(r'#', '', href)
                if href_id in href_ids:
                    self.msg(f"fixing href: #{href_id} -> #_{href_id}")
                    e.set('xlink:href', f"#_{href_id}")

    def _fixup_symbol_titles(self, node):
        if node is None:
            return
        for e in node.iter():
            if isinstance(e.tag, str) and re.match('^.*title.*$', e.tag) is not None:
                self.msg(f"deleting title: {e}")
                p = e.getparent()
                p.remove(e)
            elif isinstance(e, etree._Comment):
                self.msg(f"deleting comment: {e}")
                p = e.getparent()
                p.remove(e)

    def _fixup_symbol(self, node):
        self._fixup_symbol_ids(node)
        self._fixup_symbol_titles(node)

    def _load_symbol(self, v):
        file = os.path.join(self.svg_path(), v['file'])
        f = inkex.load_svg(file)
        r = f.getroot()
        node = r.getElementById(v['id'])
        self._fixup_symbol(node)
        return node

    def _handle_entry(self, v):
        # group,name,file,id,dx,dy,scale
        if v['group'] == '':
            return False
        if re.match('^#.*$', v['group']) is not None:
            return False
        node = self._load_symbol(v)
        if node is None:
            self.msg(f"symbol not found: {v}")
            return False
        self._install_symbol(v, node)
        return True

    def _parse_symbols_csv(self):
        self._symbols_csv = os.path.join(self.svg_path(), f"symbols.csv")
        with open(self._symbols_csv, "r", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            header = next(reader)
            values = [line for line in reader]
            for v in values:
                self._handle_entry(v)

    def _find_assets_symbols(self):
        for child in list(self._assets):
            if isinstance(child, inkex.Group) and child.label == '(Symbols)':
                self._symbols = child

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

    def _load_symbols(self):
        self.msg(f"=== load symbols: start")
        self._assets = self._find_assets()
        if self._assets is None:
            return False
        self._find_assets_symbols()
        if self._symbols is None:
            return False
        self._parse_symbols_csv()
        self.msg(f"=== load symbols: end")

    def effect(self):
        self._load_symbols()


if __name__ == "__main__":
    LoadSymbols().run()
