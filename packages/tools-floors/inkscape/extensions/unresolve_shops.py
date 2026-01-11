#!/usr/bin/env python3
# coding=utf-8

import inkex
import inkex.command
import json
import daijimaps



class UnresolveShops(daijimaps.SaveAddressesWithLocs):
    _names = {}

    def _readd_shop_name(self, node, name, x, y):
        child = daijimaps.draw_shop_name(name, x, y)
        node.append(child)

    def _fixup_unresolved_names(self, node):
        for child in list(node):
            shop = daijimaps.read_shop_name(child)
            if shop:
                # resolved shops must be abslute
                (_, name, (x, y)) = shop
                if (x == 0 and y == 0):
                    self.msg(f"resolved shop must be absolute: {shop}")
                else:
                    self._readd_shop_name(node, name, x, y)
                    node.remove(child)

    def _load_names(self, node):
        self._names = {}
        for child in list(node):
            self.msg(f"unresolve: loading (Names): {child.label}")
            shop = daijimaps.read_shop_name(child)
            if shop:
                # resolved shops must be abslute
                (address, name, (x, y)) = shop
                if name not in self._names:
                    self._names[name] = []
                self._names[name].append({ 'x': x, 'y': y })
                node.remove(child)
            else:
                self.msg(f"unresolve: loading (Names): {child.label}: failed")

    def _load_unresolved_names(self, node):
        for name, xys in self._names.items():
            for xy in xys:
                self._readd_shop_name(node, name, xy['x'], xy['y'])

    def _find_group(self, layer, label):
        for child in list(layer):
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            return child
        return None

    def _process_addresses(self, layer):
        self.msg(f"=== unresolve: start")
        names = self._find_group(layer, '(Names)')
        if names is not None:
            self.msg(f"=== unresolve: loading (Names)")
            self._load_names(names)

        unresolved_names = self._find_group(layer, '(Unresolved Names)')
        if unresolved_names is None:
            unresolved_names = inkex.Group()
            unresolved_names.label = '(Unresolved Names)'
            layer.append(unresolved_names)
        if unresolved_names is not None:
            self.msg(f"=== unresolve: loading (Unresolved Names)")
            self._load_unresolved_names(unresolved_names)
            self._fixup_unresolved_names(unresolved_names)
            self._sort_children_by_label(unresolved_names)

            #if names is not None:
            #    # XXX reflect
            #    for k, name in self._resolved_addresses.items():
            #        pass
        self.msg(f"=== unresolve: end")



if __name__ == "__main__":
    UnresolveShops().run()
