#!/usr/bin/env python3
# coding=utf-8

import inkex
import re
import daijimaps
import repeat_path


attrib_styles = inkex.all_properties.keys()

group_styles = {"display"}

invalid_styles = {
    "line-height",
    "text-align",
}


class TidyTree(daijimaps.AddressTree):
    _find_layers_opts = {
        # include '(Assets)'
        "skip_ignoring": False
    }

    def _fixup_style(self, node):
        if "display" in node.style and node.style["display"] == "inline":
            self.msg(f"fixing display: {node.label}")
            del node.style["display"]

        if "opacity" in node.style and node.style["opacity"] == "1":
            self.msg(f"fixing opacity: {node.label}")
            del node.style["opacity"]

        for k, v in node.style.items():
            if k not in group_styles:
                self.msg(f"fixing {k}: {node.label}")
                del node.style[k]
                if re.match("^-.*$", k):
                    # skip -inkscape-font-specification
                    pass
                else:
                    node.set(k, v)

    def _fixup_attrib(self, node):
        # clear attribs irrelevant for <g/>
        if isinstance(node, inkex.Group):
            for a in node.attrib:
                if a in attrib_styles:
                    self.msg(f"del {a} from node {node.label}")
                    del node.attrib[a]

        for a in node.attrib:
            if a in invalid_styles:
                self.msg(f"del {a} from node {node.label}")
                del node.attrib[a]

    def _fixup_path(self, node):
        # pass
        # has_stroke = True
        # has_stroke_width = False
        has_marker_start = False
        has_marker_end = False
        if not isinstance(node, inkex.PathElement):
            return
        for a in node.attrib:
            # if a == "stroke" and node.attrib["stroke"] == "none":
            #    has_stroke = False
            # if a == "stroke-width":
            #    has_stroke_width = True
            if a == "marker-start":
                has_marker_start = True
            if a == "marker-end":
                has_marker_end = True
        # for k, v in node.style.items():
        #    if k == "stroke" and node.style["stroke"] == "none":
        #        has_stroke = False
        #    if k == "stroke-width":
        #        has_stroke_width = True
        # if has_stroke and not has_stroke_width:
        #    self.msg(f"fixing stroke-width for {node.label}")
        #    node.attrib["stroke-width"] = "1"
        if has_marker_start:
            if node.attrib["marker-start"] != "url(#Triangle)":
                self.msg(f"fixing marker-start for {node.label}")
                node.attrib["marker-start"] = "url(#Triangle)"
        if has_marker_end:
            if node.attrib["marker-end"] != "url(#Triangle)":
                self.msg(f"fixing marker-end for {node.label}")
                node.attrib["marker-end"] = "url(#Triangle)"
        # expand repeat path
        if repeat_path.repeat_path(node):
            self.msg(f"expanding repeat path for {node.label}")

    def _sort_children(self, node):
        children = {}
        for a in list(node):
            if a.label:
                node.remove(a)
                # a.label looks like: "Sov. @ A4F-Shops-1-3"
                if a.label not in children:
                    children[a.label] = []
                children[a.label].append(a)
        # assume alphabetical order
        labels = sorted(children.keys(), key=lambda label: str.lower(label))
        for label in labels:
            for a in children[label]:
                node.append(a)

    def _fixup_facilities_use(self, kind, child):
        if child.href.get("id") == f"X{kind.label}":
            return 0
        self.msg("fixing facilities (use)")
        child.href = f"X{kind.label}"
        return 1

    def _fixup_facilities_center(self, kind, child):
        c = None
        if isinstance(child, inkex.Circle):
            c = child.center
        elif isinstance(child, inkex.Ellipse):
            c = child.center
        if c is None:
            return -1
        self.msg("fixing facilities")
        x = inkex.Use()
        x.label = child.label
        x.href = f"X{kind.label}"
        x.transform = f"translate({c.x},{c.y})"
        kind.append(x)
        kind.remove(child)
        return 1

    def _fixup_facilities(self, node):
        if not isinstance(node, inkex.Group) or node.label != "Facilities":
            return
        for kind in list(node):
            changed = False
            for child in list(kind):
                ok = None
                if isinstance(child, inkex.Use):
                    ok = self._fixup_facilities_use(kind, child)
                else:
                    ok = self._fixup_facilities_center(kind, child)
                if ok > 0:
                    changed = True
                elif ok < 0:
                    # XXX
                    return
            if changed:
                self._sort_children(kind)

    def _fixup_marker(self, node):
        if not isinstance(node, inkex.Marker):
            return
        xid = node.get("id")
        if xid == "Triangle":
            return
        self.msg(f"removing marker: {node.label}:{xid}")
        p = node.getparent()
        if p:
            p.remove(node)

    def _process_addresses(self, node):
        super()._process_addresses(node)
        self.msg("=== fixup start")
        for e in node.descendants():
            self._fixup_facilities(e)
            self._fixup_style(e)
            # XXX group style attribs have purposes & are actually used
            # self._fixup_attrib(e)
            self._fixup_path(e)
            self._fixup_marker(e)
        self.msg("=== fixup done")


if __name__ == "__main__":
    TidyTree().run()
