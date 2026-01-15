#!/usr/bin/env python3
# coding=utf-8

import daijimaps


class ResolveFacilityLinks(daijimaps.SaveAddresses):
    def _post_layers(self):
        self.msg("=== resolve facility links: start")
        self._collect_links()
        self._save_links()
        self.msg("=== resolve facility links: end")


if __name__ == "__main__":
    ResolveFacilityLinks().run()
