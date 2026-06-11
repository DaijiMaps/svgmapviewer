#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import json
import re


import inkex


import daijimaps
from daijimaps.types import TextInfoJson


SPLIT_PATTERN_SEPARATOR_RE = re.compile("^.*@@@.*$")


class ImportLabels2(daijimaps.GenerateAddresses):
    _group_label = "(Unresolved Labels)"

    def _get_floors_labels_json(self, layer_name: str) -> str | None:
        p = self._get_path(layer_name=layer_name, prefix="floors-labels", suffix="json")
        if p is not None:
            return p
        return self._get_path(layer_name=layer_name, prefix="names", suffix="txt")

    def _draw_labels(self, aparent, text):
        t = daijimaps.draw_label(text, self.options.font_size)
        aparent.append(t)

    def _draw_labels2(self, aparent, text, words, s, dy):
        t = daijimaps.draw_label2(text, words, self.options.font_size, s=s, dy=dy)
        aparent.append(t)

    def _draw_labels3(self, aparent, text: TextInfoJson):
        t = daijimaps.draw_label3(text)
        aparent.append(t)

    def _generate_addresses(self, layer, layer_name: str):
        self.msg("=== import labels: _generate_addresses")

        aparent = self._find_or_make_group(layer, self._group_label)

        path = self._get_floors_labels_json(layer_name)
        if path is None:
            self.msg("floors-labels.json not found!")
            return
        with open(path, "r", encoding="utf-8") as fh:
            texts: list[TextInfoJson] = json.load(fh)

            for text in texts:
                self._draw_labels3(aparent, text)

        layer.append(aparent)

    def _post_process_addresses(self, node: inkex.Group) -> None:
        super()._post_process_addresses(node)
        self.msg("=== import labels: _post_process_addresses")
        for addresses in list(node):
            if not isinstance(addresses, inkex.Group):
                continue
            label = addresses.label
            if label is not None and label == self._group_label:
                self._sort_children(addresses)
        # return super()._post_process_addresses(layer)

    def add_arguments(self, pars: ArgumentParser) -> None:
        return super().add_arguments(pars)


if __name__ == "__main__":
    ImportLabels2().run()
