#!/usr/bin/env python3
# coding=utf-8

from argparse import ArgumentParser

import inkex



def repeat_path_path(p: inkex.Path):
    xs = list(p.control_points)
    if len(xs) != 4:
        return None
    o = xs[0]
    v1 = xs[1] - o
    v2 = xs[2] - o
    v3 = xs[3] - o
    # checks
    if v1.dot(v2) != 0:
        return None
    if v2.cross(v3) != 0:
        return None
    d = -v1 + v2
    c = inkex.Vector2d()
    pp = inkex.Path()
    pp.append(inkex.paths.Move(o.x, o.y))
    while c.length < v3.length:
        pp.append(inkex.paths.line(v1.x, v1.y))
        pp.append(inkex.paths.move(d.x, d.y))
        c = c + v2
    pp.append(inkex.paths.line(v1.x, v1.y))
    return pp


def repeat_path(node: inkex.PathElement):
    p = node.get_path().to_absolute()
    pp = repeat_path_path(p)
    if pp == None:
        #self.msg(f"n points: {len(xs)}")
        #self.msg(f"# of points must be 4!")
        return False
    else:
        node.set_path(pp)
        return True


class RepeatPath(inkex.EffectExtension):
    def _repeat_path(self, node):
        if not isinstance(node, inkex.PathElement):
            #self.msg(f"not a path element!")
            return False
        repeat_path(node)


    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                self._repeat_path(node)



if __name__ == "__main__":
    RepeatPath().run()
