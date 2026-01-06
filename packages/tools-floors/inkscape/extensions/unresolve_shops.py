#!/usr/bin/env python3
# coding=utf-8

import inkex
import inkex.command
import json
import daijimaps



class UnresolveShops(daijimaps.SaveAddressesWithLocs):
    _names = {}

    def _readd_shop(self, node, name, x, y, bb):
        if name in self._locs:
            locs = self._locs[name]
            child = daijimaps.put_shop(None, x, y, bb, None, locs)
            node.append(child)
            return True
        else:
            return False

    def _fixup_unresolved_names(self, node):
        xshop1 = self.svg.getElementById("XShop1")
        if xshop1 is None:
            return
        bb = xshop1.bounding_box()
        for child in list(node):
            shop = daijimaps.read_shop(child)
            if shop:
                # resolved shops must be abslute
                (address, name, (tx, ty), (ax, ay), scale) = shop
                if (ax == 0 and ay == 0) or (ax == None and ay == None):
                    self.msg(f"resolved shop must be absolute: {shop}")
                else:
                    if self._readd_shop(node, name, ax, ay, bb):
                        node.remove(child)

    def _load_names(self, node):
        self._names = {}
        for child in list(node):
            self.msg(f"unresolve: loading (Names): {child.label}")
            shop = daijimaps.read_shop(child)
            if shop:
                # resolved shops must be abslute
                (address, name, (tx, ty), (ax, ay), scale) = shop
                if name not in self._names:
                    self._names[name] = []
                self._names[name].append({ 'x': ax, 'y': ay })
                node.remove(child)
            else:
                self.msg(f"unresolve: loading (Names): {child.label}: failed")

    def _load_unresolved_names(self, node):
        xshop1 = self.svg.getElementById("XShop1")
        if xshop1 is None:
            return
        bb = xshop1.bounding_box()
        for name, xys in self._names.items():
            for xy in xys:
                self._readd_shop(node, name, xy['x'], xy['y'], bb)

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
