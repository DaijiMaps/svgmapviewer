#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser
import inkex


class UseShop(inkex.EffectExtension):
    def _change_use_href(self, node, id_string):
        if not isinstance(node, inkex.Use):
            return
        node.href = id_string

    def add_arguments(self, pars: ArgumentParser) -> None:
        pars.add_argument("--tab", type=str, dest="tab")
        pars.add_argument("--href", type=str, default="XShop1")
        return super().add_arguments(pars)

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._change_use_href(node, self.options.href)


if __name__ == "__main__":
    UseShop().run()
