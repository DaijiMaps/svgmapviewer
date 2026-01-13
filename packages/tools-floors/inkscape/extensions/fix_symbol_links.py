#!/usr/bin/env python3
# coding=utf-8

import inkex

import daijimaps



class FixSymbolLinks(daijimaps.AddressTree):
    # XXX Find Content/Facilities
    # XXX Find Toilets
    # XXX Iterate children
    # XXX   Check if child has transform="translate()"
    # XXX   Check if child is <use/> or <g>
    # XXX   If not correct, regen <use/> with the correct href

    def _make_use(self, kind, target):
        x = inkex.Use()
        x.label = target.label
        x.attrib['href'] = f"X{kind}"
        x.attrib['transform'] = target.atrib['transform']
        return x

    def _is_good_use(self, child, kind):
        if isinstance(child, inkex.Use):
            if 'transform' in child.attrib:
                if 'href' in child.attrib:
                    if child.attrib['href'] == f"X{kind}":
                        return True
        return False

    def _find_group(self, layer, label):
        for child in list(layer):
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            return child
        return None

    def _process_addresses(self, layer):
        content = self._find_group(layer, 'Content')
        if content is None:
            return False
        facilities = self._find_group(content, 'Facilities')
        if facilities is None:
            return False
        for facility in list(facilities):
            # e.g. kind == Toilets
            kind = facility.label
            if kind == None:
                continue
            if self.svg.getElementById(f"X{kind}") == None:
                self.msg(f"unknown facility kind: {kind}")
                continue
            for child in list(facility):
                # XXX style => attribute
                if self._is_good_use(child, kind):
                    # good - nothing to do
                    continue
                # fixup
                self.msg(f"fixup use: {facility}: {kind}")
                x = self._make_use(kind, child)
                facility.remove(child)
                facility.append(x)


if __name__ == "__main__":
    FixSymbolLinks().run()
