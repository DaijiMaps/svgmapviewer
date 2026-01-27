#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps


class ImportShops(daijimaps.GenerateAddresses):
    _group_label = "(Unresolved Names)"

    def _get_shops_txt(self):
        p = self._get_path("names", "txt")
        if p is None:
            p = self._get_path("shops", "txt")
        return p

    def _draw_shop_names(self, aparent, text):
        g = daijimaps.draw_name(text)
        aparent.append(g)

    def _generate_addresses(self, layer):
        self.msg("=== import shops: _generate_addresses")
        aparent = inkex.Group()
        aparent.label = self._group_label

        path = self._get_shops_txt()
        if path is None:
            self.msg("shops.txt not found!")
            return
        with open(path, "r", encoding="utf-8") as fh:
            texts = [text for text in [line.strip() for line in fh.readlines()]]
            for text in texts:
                self._draw_shop_names(aparent, text)

        layer.append(aparent)

    def _post_process_addresses(self, node) -> None:
        super()._post_process_addresses(node)
        self.msg("=== import shops: _post_process_addresses")
        for addresses in list(node):
            if addresses.label == self._group_label:
                self._sort_children(addresses)


if __name__ == "__main__":
    ImportShops().run()
