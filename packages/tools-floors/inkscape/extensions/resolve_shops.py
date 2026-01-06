#!/usr/bin/env python3
# coding=utf-8

import inkex
import inkex.command
import json
import daijimaps



class ResolveShops(daijimaps.SaveAddressesWithLocs):
    _names = {}

    def _load_names(self, node):
        res = {}
        for child in list(node):
            shop = daijimaps.read_shop(child)
            if shop:
                (address, name, txy, axy, scale) = shop
                res[address] = name
        return res

    def _load_unresolved_names(self, node):
        res = {}
        for child in list(node):
            shop = daijimaps.read_shop(child)
            if shop:
                # unresolved shops must be relative
                (address, name, (tx, ty), (ax, ay), scale) = shop
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
        exe = '/Users/uebayasi/Documents/Sources/DaijiMaps/cli/dist/misc-resolve-addresses.js'
        # XXX
        # XXX
        # XXX

        return inkex.command.call(
            exe, self._addresses_json, self._coords_json, self._resolved_names_json)

    def _resolve_names(self, names, unresolved_names):
        self._exec_resolve()

        with open(self._resolved_names_json) as f:
            j = json.load(f)
            self._resolved_addresses = j

        for name, addresses in self._resolved_addresses.items():
            if name in self._names:
                # used!
                self.msg(f"{name} is placed near address {a} but the address already used by {self._names[a]}, skipping")
            else:
                for a in addresses:
                    ((px, py), bb, href) = self._addresses[a]
                    if name in self._locs:
                        locs = self._locs[name]
                        g = daijimaps.draw_shop(a, px, py, bb, href, locs)
                        names.append(g)
                        for child in list(unresolved_names):
                            if child.label == name:
                                unresolved_names.remove(child)
                    else:
                        self.msg(f"locs not found for {name}")

    def _find_group(self, layer, label):
        for child in list(layer):
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            return child
        return None

    def _process_addresses(self, layer):
        self.msg(f"=== resolve: start")
        names = self._find_group(layer, '(Names)')
        if names is not None:
            j = self._load_names(names)
            self._names = j
        else:
            names = inkex.Group()
            names.label = '(Names)'
            layer.append(names)
            self._names = {}

        unresolved_names = self._find_group(layer, '(Unresolved Names)')
        if unresolved_names is None:
            unresolved_names = {}
        j = self._load_unresolved_names(unresolved_names)
        with open(self._coords_json, 'w') as f:
            json.dump(j, f)

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
