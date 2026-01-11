#!/usr/bin/env python3
# coding=utf-8

import inkex
import inkex.command
import json
import os
import daijimaps



class ResolveShops(daijimaps.SaveAddressesWithLocs):
    _names = {}

    def _load_names(self, node):
        res = {}
        for child in list(node):
            shop = daijimaps.read_shop_name(child)
            if shop:
                (address, name, txy) = shop
                res[address] = name
        return res

    def _load_unresolved_names(self, node):
        res = {}
        for child in list(node):
            shop = daijimaps.read_shop_name(child)
            self.msg(f"_load_unresolved_names {shop}")
            if shop:
                # unresolved shops must be relative
                (address, name, (tx, ty)) = shop
                if tx != None and ty != None:
                    if name not in res:
                        res[name] = [{ 'x': tx, 'y': ty }]
                    else:
                        res[name].append({ 'x': tx, 'y': ty })
        return res

    def _exec_resolve(self):
        # XXX
        # XXX
        # XXX
        #exe = '/Users/uebayasi/Documents/Sources/DaijiMaps/cli/dist/misc-resolve-addresses.js'
        exe = '/tmp/resolve-addresses'
        # XXX
        # XXX
        # XXX

        return inkex.command.call(
            exe, self._addresses_json, self._coords_json, self._resolved_names_json)

    def _resolve_names(self, names, unresolved_names):
        self._exec_resolve()

        with open(self._resolved_names_json, "r", encoding="utf-8") as f:
            j = json.load(f)
            self._resolved_addresses = j

        for name, addresses in self._resolved_addresses.items():
            if name in self._names:
                # used!
                self.msg(f"{name} is placed near address {a} but the address already used by {self._names[a]}, skipping")
            else:
                for a in addresses:
                    ((px, py), bb, href) = self._addresses[a]
                    t = daijimaps.draw_shop_name(f"{name} @ {a}", px, py)
                    names.append(t)
                    for child in list(unresolved_names):
                        if child.label == name:
                            unresolved_names.remove(child)

    def _find_group(self, layer, label):
        for child in list(layer):
            self.msg(f"_find_group: {child.label}")
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            self.msg(f"_find_group: found: {child.label}")
            return child
        return None

    def _process_addresses(self, layer):
        self.msg(f"=== resolve: start")
        names = self._find_group(layer, '(Names)')
        self.msg(f"_process_addresses: names {names}")
        if names is not None:
            j = self._load_names(names)
            self._names = j
        else:
            names = inkex.Group()
            names.label = '(Names)'
            layer.append(names)
            self._names = {}

        unresolved_names = self._find_group(layer, '(Unresolved Names)')
        self.msg(f"_process_addresses: unresolved_names {unresolved_names}")
        if unresolved_names is None:
            unresolved_names = {}
        j = self._load_unresolved_names(unresolved_names)
        self.msg(f"saving coords json: {j}")
        d = os.path.dirname(self._coords_json)
        try:
            os.stat(d)
        except:
            os.mkdir(d)
        with open(self._coords_json, 'w', encoding="utf-8") as f:
            json.dump(j, f, indent=2, ensure_ascii=False)

        if names is not None and unresolved_names is not None:
            self._resolve_names(names, unresolved_names)
            self._sort_children_by_label(names)
        self.msg(f"=== resolve: end")

    # XXX
    def _post_layers(self):
        if self.options.floor != '.':
            # avoid incomplete links
            self.msg(f"=== resolve facility links: skip")
            return
        self.msg(f"=== resolve facility links: start")
        self._collect_links()
        self._save_links()
        self.msg(f"=== resolve facility links: end")



if __name__ == "__main__":
    ResolveShops().run()
