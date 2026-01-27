#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps


class UnresolveShops(daijimaps.ResolveNames):
    def _move_unresolved_name(
        self,
        names_group: inkex.Group,
        unresolved_names_group: inkex.Group,
        name: str,
        address: daijimaps.AddressString | None,
        x: float,
        y: float,
    ) -> None:
        label = name if address is None else f"{name} @ {address}"
        daijimaps.move_name(names_group, unresolved_names_group, label, name, x, y)

    def _move_unresolved_names(
        self, names_group: inkex.Group, unresolved_names_group: inkex.Group
    ) -> None:
        for name, addresses in self._resolved_names.items():
            for address, (x, y) in addresses:
                self._move_unresolved_name(
                    names_group, unresolved_names_group, name, address, x, y
                )
        self._sort_children(unresolved_names_group)

    def _process_addresses(self, node: inkex.Group) -> None:
        self.msg("=== unresolve: start")

        names_group = self._prepare_names_group(node)
        unresolved_names_group = self._prepare_unresolved_names_group(node)

        if names_group is None:
            self.msg("(Names) group does not exist!")
            return
        if unresolved_names_group is None:
            self.msg("(Unresolved Names) group does not exist!")
            return

        self._move_unresolved_names(names_group, unresolved_names_group)

        self._read_resolved_names(names_group)
        self._save_resolved_names()
        self._read_unresolved_names(unresolved_names_group)
        self._save_unresolved_names()

        self.msg("=== unresolve: end")


if __name__ == "__main__":
    UnresolveShops().run()
