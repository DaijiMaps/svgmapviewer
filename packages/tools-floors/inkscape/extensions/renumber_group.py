#!/usr/bin/env python3
# coding=utf-8

import inkex

from daijimaps import renumber_group



class RenumberGroup(inkex.EffectExtension):
    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                renumber_group(node)


if __name__ == "__main__":
    RenumberGroup().run()
