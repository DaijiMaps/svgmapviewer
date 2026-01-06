#!/usr/bin/env python3
# coding=utf-8

import inkex
import json
import os
import sys
import daijimaps


class ImportShops(daijimaps.GenerateAddresses):
    _group_label = "(Unresolved Names)"

    def _draw_shops(self, aparent, k, x, y, bb, href, locs):
        g = daijimaps.draw_shop(k, x, y, bb, href, locs)
        aparent.append(g)

    def _generate_addresses(self, layer):
        aparent = inkex.Group()
        aparent.label = self._group_label

        xshop1 = self.svg.getElementById("XShop1")
        if xshop1 is None:
            return
        bb = xshop1.bounding_box()

        path = os.path.join(self.svg_path(), f"shops_{self._layer_name}.txt")
        with open(path, "r") as fh:
            texts = [
                text for text in [line.strip() for line in fh.readlines()]
                    if text in self._locs
            ]
            for text in texts:
                locs = self._locs[text]
                self._draw_shops(aparent, None, 0, 0, bb, None, locs)

        layer.append(aparent)

    def _post_process_addresses(self, layer):
        super()._post_process_addresses(layer)
        for addresses in list(layer):
            if addresses.label == self._group_label:
                self._sort_children_by_label(addresses)
        return super()._post_process_addresses(layer)

if __name__ == "__main__":
    ImportShops().run()
