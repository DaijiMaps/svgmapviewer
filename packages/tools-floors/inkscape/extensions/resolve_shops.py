#!/usr/bin/env python3
# coding=utf-8

import inkex
import json
import os
import sys
import daijimaps



class ResolveShops(daijimaps.ResolveNames):
    def _draw_resolved_names(self, names_group: inkex.Group, unresolved_names_group: inkex.Group) -> None:
        self.msg(f"drawing result {self._tmp_resolved_names}")
        for name, astrs in self._tmp_resolved_names.items():
            for astr in astrs:
                label = f"{name} @ {astr}"
                for child in names_group:
                    if child.label == label:
                        names_group.remove(child)
                ((x, y), _bb, _href) = self._addresses[astr]
                t = daijimaps.draw_name(label, x, y)
                names_group.append(t)
                for child in list(unresolved_names_group):
                    if child.label == name:
                        unresolved_names_group.remove(child)

    def _process_addresses(self, layer) -> None:
        self.msg(f"=== resolve: start")

        names_group = self._prepare_names_group(layer)
        unresolved_names_group = self._prepare_unresolved_names_group(layer)

        if names_group is None:
            self.msg(f"(Names) group does not exist!")
            return
        if unresolved_names_group is None:
            self.msg(f"(Unresolved Names) group does not exist!")
            return
        
        self._save_tmp_unresolved_names()
        self._exec_resolve()
        self._load_tmp_resolved_names()
        self._draw_resolved_names(names_group, unresolved_names_group)
        self._sort_children_by_label(names_group)
        
        self._read_resolved_names(names_group)
        self._save_resolved_names()
        self._read_unresolved_names(unresolved_names_group)
        self._save_unresolved_names()

        self.msg(f"=== resolve: end")

    # XXX
    def _post_layers(self) -> None:
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
