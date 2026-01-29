import json
import re

import inkex

from daijimaps.guards import isGroup, isTextElement, isTspan
from daijimaps.types import TextInfoJson, TspanInfoJson


layer_label_re = re.compile("^[^(].*$")


type Labels = list[TextInfoJson]
type FloorLabels = dict[str, Labels]


class ExtractLabels(inkex.OutputExtension):
    def add_arguments(self, pars) -> None:
        pass

    def _textToInfo(self, e: inkex.TextElement) -> TextInfoJson:
        children = []
        for child in list(e):
            if not isTspan(child):
                continue
            info: TspanInfoJson = {
                "attrs": dict(child.attrib.items()),
                "text": child.text,
            }
            children.append(info)
        info: TextInfoJson = {
            "attrs": dict(e.attrib.items()),
            "children": children,
        }
        return info

    def _collectLabels(self, layer: inkex.Group) -> Labels | None:
        j = []
        xs = layer.xpath(
            './*[@*[name()="inkscape:label"]="Content"]/*[@*[name()="inkscape:label"]="(Labels)"]'
        )
        if not isinstance(xs, list) or len(xs) != 1:
            return None
        x = xs[0]
        if not isGroup(x):
            return None
        for child in list(x):
            if not isTextElement(child):
                continue
            j.append(self._textToInfo(child))
        return j

    def _collectFloors(self) -> FloorLabels:
        j: FloorLabels = {}
        layers = self.svg.xpath('/*/*[@*[name()="inkscape:groupmode"]="layer"]')
        for layer in list(layers):
            if not isGroup(layer):
                continue
            label = layer.label
            if label is None or not layer_label_re.match(label):
                continue
            labels = self._collectLabels(layer)
            if labels is None:
                continue
            j[label] = labels
        return j

    def save(self, stream) -> None:
        j: FloorLabels = self._collectFloors()
        b = json.dumps(j, indent=2).encode("utf-8")
        stream.write(b)


if __name__ == "__main__":
    ExtractLabels().run()
