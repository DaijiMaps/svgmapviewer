#!/usr/bin/env python3
# coding=utf-8

import inkex
import json
import os
import sys
import daijimaps


class ImportShops(daijimaps.GenerateAddresses):
    _group_label = "(Unresolved Names)"
    
    def _get_shops_txt(self):
        ps = [
            f"shops/{self._layer_name}.txt",
            f"shops_{self._layer_name}.txt",
        ]
        for p in ps:
            path = os.path.join(self.svg_path(), p)
            self.msg(f"_get_shops_txt: {path}")
            if os.access(path, os.R_OK):
                self.msg(f"_get_shops_txt: found: {path}")
                return path
        return None
    

    def _draw_shops(self, aparent, k, x, y, bb, href, locs):
        g = daijimaps.draw_shop(k, x, y, bb, href, locs)
        aparent.append(g)

    def _draw_shop_names(self, aparent, text):
        g = daijimaps.draw_shop_name(text)
        aparent.append(g)

    def _generate_addresses(self, layer):
        self.msg(f"=== import shops: _generate_addresses")
        aparent = inkex.Group()
        aparent.label = self._group_label

        xshop1 = self.svg.getElementById("XShop1")
        if xshop1 is None:
            self.msg("_generate_addresses: XShop1 not found!")
            return
        bb = xshop1.shape_box()
        for child in xshop1:
            self.msg(f"_generate_addresses: child shape?: {isinstance(child, inkex.ShapeElement)}")
            self.msg(f"_generate_addresses: child visible?: {child.is_visible()}")
        self.msg(f"_generate_addresses: XShop1={xshop1}; bb={bb}")

        path = self._get_shops_txt()
        if (path is None):
            self.msg(f"shops.txt not found!")
            return
        with open(path, "r", encoding="utf-8") as fh:
            texts = [
                text for text in [line.strip() for line in fh.readlines()]
                    #if text in self._locs
            ]
            for text in texts:
                self._draw_shop_names(aparent, text)

        layer.append(aparent)

    def _post_process_addresses(self, layer):
        super()._post_process_addresses(layer)
        self.msg(f"=== import shops: _post_process_addresses")
        for addresses in list(layer):
            if addresses.label == self._group_label:
                self._sort_children_by_label(addresses)
        return super()._post_process_addresses(layer)

if __name__ == "__main__":
    ImportShops().run()
