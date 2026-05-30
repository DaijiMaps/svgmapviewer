#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import re


import inkex


import daijimaps


SPLIT_PATTERN_SEPARATOR_RE = re.compile("^.*@@@.*$")


class ImportLabels(daijimaps.GenerateAddresses):
    _group_label = "(Unresolved Labels)"

    def _get_labels_txt(self, layer_name: str) -> str | None:
        p = self._get_path(layer_name=layer_name, prefix="labels", suffix="txt")
        if p is not None:
            return p
        return self._get_path(layer_name=layer_name, prefix="names", suffix="txt")

    def _draw_labels(self, aparent, text):
        t = daijimaps.draw_label(text, self.options.font_size)
        aparent.append(t)

    def _draw_labels2(self, aparent, text, words, s, dy):
        t = daijimaps.draw_label2(text, words, self.options.font_size, s=s, dy=dy)
        aparent.append(t)

    def _generate_addresses(self, layer, layer_name: str):
        self.msg("=== import labels: _generate_addresses")

        aparent = self._find_or_make_group(layer, self._group_label)

        path = self._get_labels_txt(layer_name)
        if path is None:
            self.msg("labels.txt not found!")
            return
        with open(path, "r", encoding="utf-8") as fh:
            texts = [text for text in [line.strip() for line in fh.readlines()]]
            for text in texts:
                if SPLIT_PATTERN_SEPARATOR_RE.match(text):
                    entries = text.split("@@@")
                    if len(entries) != 4:
                        self.msg(f"invalid split pattern: {text}")
                        continue
                    (numbered_name, pat, s, dy) = entries
                    num_words = numbered_name.split(" ")
                    if len(num_words) < 2:
                        self.msg(f"invalid numbered name: {numbered_name}")
                        continue
                    num = num_words[0]
                    pat_words = (
                        num_words if len(pat) == 0 else f"{num}///{pat}".split("///")
                    )
                    self._draw_labels2(
                        aparent, numbered_name, pat_words, s=float(s), dy=float(dy)
                    )
                else:
                    self._draw_labels(aparent, text)

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
        pars.add_argument("--font_size", type=float, default=5)
        return super().add_arguments(pars)


if __name__ == "__main__":
    ImportLabels().run()
