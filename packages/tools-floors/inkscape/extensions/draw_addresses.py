#!/usr/bin/env python3
# coding=utf-8

import inkex
import daijimaps


class DrawAddresses(daijimaps.GenerateAddresses):
    def _draw_addresses(self, aparent, k, x, y, bb, href):
        atext = daijimaps.draw_address(k, x, y, bb, href)
        aparent.append(atext)

    def _generate_addresses_address(self, aparent, k, x, y, bb, href):
        self._draw_addresses(aparent, k, x, y, bb, href)

    def effect(self):
        super().effect()


if __name__ == "__main__":
    DrawAddresses().run()
