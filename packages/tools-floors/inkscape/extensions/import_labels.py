#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps


class ImportLabels(daijimaps.GenerateAddresses):
    _group_label = "(Labels)"
    _font_size = 5

    def _get_labels_txt(self):
        p = self._get_path("labels", "txt")
        return p

    def _draw_labels(self, aparent, text):
        g = daijimaps.draw_label(text, self._font_size)
        aparent.append(g)

    def _generate_addresses(self, layer):
        self.msg("=== import labels: _generate_addresses")
        aparent = inkex.Group()
        aparent.label = self._group_label

        path = self._get_labels_txt()
        if path is None:
            self.msg("labels.txt not found!")
            return
        with open(path, "r", encoding="utf-8") as fh:
            texts = [text for text in [line.strip() for line in fh.readlines()]]
            for text in texts:
                self._draw_labels(aparent, text)

        layer.append(aparent)

    def _post_process_addresses(self, layer):
        super()._post_process_addresses(layer)
        self.msg("=== import labels: _post_process_addresses")
        for addresses in list(layer):
            if addresses.label == self._group_label:
                self._sort_children(addresses)
        return super()._post_process_addresses(layer)


if __name__ == "__main__":
    ImportLabels().run()
