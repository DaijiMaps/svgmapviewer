#!/usr/bin/env python3
# coding=utf-8

import inkex


class FixGuides(inkex.EffectExtension):
    def _show_guide(self, guide):
        self.msg(
            "guide:"
            + f" id={guide.get('id')}"
            + f" position={guide.raw_position}"
            + f" orientation={guide.orientation}"
        )

    def _do_guide(self, guide):
        # self._show_guide(guide)
        p = guide.raw_position
        h = self.svg.viewbox_height
        x = p[0]
        y = h - p[1]
        guide.set_position(x, y, guide.orientation)

    def effect(self):
        for guide in self.svg.namedview.get_guides():
            self._do_guide(guide)


if __name__ == "__main__":
    FixGuides().run()
