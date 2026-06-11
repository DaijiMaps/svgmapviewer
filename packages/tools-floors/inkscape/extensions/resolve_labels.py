#!/usr/bin/env python3
# coding=utf-8
import math

import inkex
import inkex.command

import daijimaps
import daijimaps.resolve_labels
from daijimaps.unit import mm_from_px


class ResolveLabels(daijimaps.resolve_labels.ResolveLabels):
    _bounding_boxes: dict[str, inkex.BoundingBox] = {}

    def _reset(self) -> None:
        super()._reset()
        self._bounding_boxes = {}

    def _exec_query_all(self) -> str:
        return inkex.command.call(
            "inkscape",
            "--query-all",
            self.document_path(),
        )

    def _load_bounding_boxes(self) -> None:
        self._bounding_boxes = {}
        query_all_result = self._exec_query_all()
        # self.msg(f"query_all_result: {query_all_result}")
        for line in query_all_result.splitlines():
            if len(line) == 0:
                continue
            try:
                (id, x, y, width, height) = line.split(",")
                bb = inkex.BoundingBox.new_xywh(
                    float(x), float(y), float(width), float(height)
                )
                self._bounding_boxes[id] = bb
            except Exception as e:
                self.msg(f"failed to parse --query-all result: {line}: {e}")

    def _move_resolved_name(
        self,
        names_group: inkex.Group,
        unresolved_names_group: inkex.Group,
        astr: str,
        name: str,
    ) -> None:
        label = f"{name} @ {astr}"
        (v, _bb, _href) = self._addresses[astr]
        daijimaps.move_name(
            unresolved_names_group, names_group, name, label, v["x"], v["y"]
        )

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

    def _process_addresses(self, node) -> None:
        self._reset()

        self.msg("=== resolve: start")

        self._load_bounding_boxes()
        # self.msg(f"_bounding_boxes: {self._bounding_boxes}")

        names_group = self._prepare_names_group(node)
        if names_group is None:
            self.msg("(Names) group does not exist!")
            return

        unresolved_labels_group = self._prepare_unresolved_labels_group(node)
        if unresolved_labels_group is None:
            self.msg("(Unresolved Labels) group does not exist!")
            return

        labels_group = self._prepare_labels_group(node)
        if labels_group is None:
            self.msg("(Labels) group does not exist!")
            return

        # self.msg(f"_unresolved_labels: {self._unresolved_labels}")

        for name, text_element in self._unresolved_labels.items():
            name_addresses = self._resolved_names.get(name)
            if name_addresses is None:
                self.msg(f"_unresolved_labels: {name} {text_element}: no resolved name")
                continue
            bb = self._bounding_boxes.get(text_element.get_id())
            if bb is None:
                self.msg(f"_unresolved_labels: {name} {text_element}: no bounding box")
                continue
            c = bb.center
            (w, h) = (
                mm_from_px(bb.width),
                mm_from_px(bb.height),
            )
            if c is None:
                self.msg(f"_unresolved_labels: {name} {text_element}: no center")
                continue
            # XXX TODO Support multiple addresses for a name
            (name_address, v) = name_addresses[0]
            if name_address is None:
                self.msg(f"_unresolved_labels: {name} {text_element}: no address")
                continue
            area = (
                None
                if name_address not in self._address_areas
                else self._address_areas[name_address]
            )
            self.msg(f"!!!\nv = {v}\narea = {area}\n!!!")
            dcx = -mm_from_px(c.x)  # XXX unit
            dcy = -mm_from_px(c.y)  # XXX unit
            self.msg(
                f"_unresolved_labels: {name}@{v} -> {c} ({v['x'] + dcx}, {v['y'] + dcy})"
            )
            # t = text_element.transform
            s = text_element.get("data-s")
            s = float(s) if s is not None else 1.0
            s = math.sqrt(math.sqrt(s))

            # XXX
            # XXX
            # XXX
            # XXX
            # XXX
            t2 = (
                # t.add_translate(dcx, dcy).add_translate(x, y)
                # if t is not None
                # else
                inkex.Transform(
                    f"translate({v['x']},{v['y']}) scale({s}) translate({dcx},{dcy})"
                )
            )
            # XXX
            # XXX
            # XXX
            # XXX
            # XXX

            text_element.transform = t2
            text_element.set("data-x", str(round(v["x"], 2)))
            text_element.set("data-y", str(round(v["y"], 2)))
            text_element.set("data-w", str(round(w, 2)))
            text_element.set("data-h", str(round(h, 2)))

            text_element.label = f"{name} @ {name_address}"

            parent = text_element.getparent()
            if parent is not None:
                parent.remove(text_element)
            labels_group.append(text_element)

        # resolve labels!
        self._resolve_labels()

        # self._move_resolved_names(names_group, unresolved_names_group)

        # self._read_resolved_names(names_group)
        # self._save_resolved_names()
        # self._read_unresolved_names(unresolved_names_group)
        # self._save_unresolved_names()

        # self._save_floors_addresses()
        # self._save_floors_names()

        self.msg("=== resolve: end")


if __name__ == "__main__":
    ResolveLabels().run()
