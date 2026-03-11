#!/usr/bin/env python3
# coding=utf-8

import json

import inkex

import daijimaps


class LoadShops(daijimaps.ResolveNames):
    def _move_resolved_name(
        self,
        names_group: inkex.Group,
        unresolved_names_group: inkex.Group,
        astr: str,
        name: str,
    ) -> None:
        label = f"{name} @ {astr}"
        ((x, y), _bb, _href) = self._addresses[astr]
        daijimaps.move_name(unresolved_names_group, names_group, name, label, x, y)

    def _move_resolved_names(
        self, names_group: inkex.Group, unresolved_names_group: inkex.Group
    ) -> None:
        self.msg(f"drawing result {self._tmp_resolved_names}")
        for name, astrs in self._tmp_resolved_names.items():
            for astr in astrs:
                self._move_resolved_name(
                    names_group, unresolved_names_group, astr, name
                )
        self._sort_children(names_group)

    def _load_resolved_names(self) -> None:
        with open(self._layerPaths["floorsNames"], mode="r", encoding="utf-8") as f:
            j = json.load(f)
            if not isinstance(j, dict):
                self.msg("invalid floorsNames.json")
                return
            for name in j:
                if not isinstance(name, str):
                    self.msg("invalid floorsNames.json: name is not string")
                    return
                astrs = j[name]
                if not isinstance(astrs, list):
                    self.msg("invalid floorsNames.json: astrs is not list")
                    return
                for astr in astrs:
                    if not isinstance(astr, str):
                        self.msg(
                            "invalid floorsNames.json: astr is not string (name={name})"
                        )
                        return
            self._tmp_resolved_names = j

    def _process_addresses(self, node) -> None:
        self.msg("=== load: start")

        names_group = self._prepare_names_group(node)
        unresolved_names_group = self._prepare_unresolved_names_group(node)

        if names_group is None:
            self.msg("(Names) group does not exist!")
            return
        if unresolved_names_group is None:
            self.msg("(Unresolved Names) group does not exist!")
            return

        # load names!
        self._load_resolved_names()

        self._move_resolved_names(names_group, unresolved_names_group)

        self._read_resolved_names(names_group)
        self._save_resolved_names()
        self._read_unresolved_names(unresolved_names_group)
        self._save_unresolved_names()

        self._save_floors_addresses()
        self._save_floors_names()

        self.msg("=== load: end")


if __name__ == "__main__":
    LoadShops().run()
