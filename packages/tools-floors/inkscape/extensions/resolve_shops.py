#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps


def add_name(group: inkex.Group, name: str, x: float, y: float) -> None:
    t = daijimaps.draw_name(name, x, y)
    group.append(t)


def remove_children_by_label(group: inkex.Group, label: str) -> None:
    for child in group:
        if child.label == label:
            group.remove(child)


class ResolveShops(daijimaps.ResolveNames):
    def _move_resolved_name(
        self,
        names_group: inkex.Group,
        unresolved_names_group: inkex.Group,
        astr: str,
        name: str,
    ) -> None:
        label = f"{name} @ {astr}"
        ((x, y), _bb, _href) = self._addresses[astr]
        remove_children_by_label(names_group, label)
        add_name(names_group, label, x, y)
        remove_children_by_label(unresolved_names_group, name)

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

    def _process_addresses(self, layer) -> None:
        self.msg("=== resolve: start")

        names_group = self._prepare_names_group(layer)
        unresolved_names_group = self._prepare_unresolved_names_group(layer)

        if names_group is None:
            self.msg("(Names) group does not exist!")
            return
        if unresolved_names_group is None:
            self.msg("(Unresolved Names) group does not exist!")
            return

        # resolve names!
        self._save_tmp_unresolved_names()
        self._exec_resolve()
        self._load_tmp_resolved_names()

        self._move_resolved_names(names_group, unresolved_names_group)

        self._read_resolved_names(names_group)
        self._save_resolved_names()
        self._read_unresolved_names(unresolved_names_group)
        self._save_unresolved_names()

        self._save_floors_addresses()
        self._save_floors_names()

        self.msg("=== resolve: end")

    # XXX
    def _post_layers(self) -> None:
        if self.options.floor != ".":
            # avoid incomplete links
            self.msg("=== resolve facility links: skip")
            return
        self.msg("=== resolve facility links: start")
        self._collect_links()
        self._save_links()
        self.msg("=== resolve facility links: end")


if __name__ == "__main__":
    ResolveShops().run()
