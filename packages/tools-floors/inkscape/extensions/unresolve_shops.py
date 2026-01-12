#!/usr/bin/env python3
# coding=utf-8

import inkex
import inkex.command
import json
import os
import daijimaps



class UnresolveShops(daijimaps.ResolveNames):
    def _fixup_unresolved_names(self, node) -> None:
        for child in list(node):
            shop = daijimaps.read_name(child)
            if shop:
                # resolved shops must be abslute
                (_, name, (x, y)) = shop
                if (x == 0 and y == 0):
                    self.msg(f"resolved shop must be absolute: {shop}")
                else:
                    #child = daijimaps.draw_name(name, x, y)
                    #node.append(child)
                    #node.remove(child)
                    pass

    def _put_unresolved_names(self, node) -> None:
        for name, addresses in self._resolved_names.items():
            for (_address, (x, y)) in addresses:
                child = daijimaps.draw_name(name, x, y)
                node.append(child)

    def _process_addresses(self, layer) -> None:
        self.msg(f"=== unresolve: start")

        names_group = self._prepare_names_group(layer)
        unresolved_names_group = self._prepare_unresolved_names_group(layer)

        if names_group is None:
            self.msg(f"(Names) group does not exist!")
            return
        if unresolved_names_group is None:
            self.msg(f"(Unresolved Names) group does not exist!")
            return

        self.msg(f"=== unresolve: loading (Names)")
        self._read_resolved_names(names_group)
        self._remove_children(names_group)

        self.msg(f"=== unresolve: loading (Unresolved Names)")
        self._put_unresolved_names(unresolved_names_group)
        self._fixup_unresolved_names(unresolved_names_group)
        self._sort_children_by_label(unresolved_names_group)
        
        self._read_resolved_names(names_group)
        self._save_resolved_names()
        self._read_unresolved_names(unresolved_names_group)
        self._save_unresolved_names()

        self.msg(f"=== unresolve: end")



if __name__ == "__main__":
    UnresolveShops().run()
