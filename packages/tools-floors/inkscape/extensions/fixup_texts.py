import re

import inkex

from daijimaps.guards import isTextElement, isTspan


# - fix nested tspans
# - remove tspan's style
# - remove tspan's dy
# - trim whitespaces in tspan
# - remove non-tspan elements (if exists)


class FixupTexts(inkex.EffectExtension):
    def _joinTextTail(self, elem: inkex.Tspan) -> str:
        texts = []
        text = elem.text
        if isinstance(text, str) and len(text) > 0:
            texts.append(elem.text)
        tail = elem.tail
        if isinstance(tail, str) and len(tail) > 0:
            texts.append(elem.tail)
        return " ".join(texts)

    def _collectTexts(self, elem: inkex.Tspan) -> str:
        subtexts: list[str] = []
        for child in list(elem):
            self.msg(f"! tspan child (text={child.text} tail={child.tail})")
            if isTspan(child):
                text = self._collectTexts(child)
                self.msg(f"! tspan child (text={text})")
                if isinstance(text, str) and len(text) > 0:
                    subtexts.append(text)
        if len(subtexts) > 0:
            text = self._joinTextTail(elem)
            subtexts.append(text)
            res = " ".join(subtexts)
            self.msg(f"! merged tspan (res={res})")
            return res
        else:
            res = self._joinTextTail(elem)
            self.msg(f"! unmerged tspan (res={res})")
            return res

    def _fixupTspan(self, elem: inkex.Tspan) -> None:
        text = self._collectTexts(elem)
        text = trim(text)
        self.msg(f"tspan: {text}")
        elem.style = None
        if "dy" in elem.attrib:
            del elem.attrib["dy"]
        for child in list(elem):
            self.msg(f"! removing children (id={elem.get_id()})")
            elem.remove(child)
        if elem.text != text:
            self.msg(f"! updating text ({elem.text} -> {text})")
            elem.text = text

    def _fixupTextElement(self, elem: inkex.TextElement) -> None:
        self.msg(f"fixing text (id={elem.get_id()})")
        for child in list(elem):
            if not isTspan(child):
                # XXX msg
                self.msg("! not tspan!")
                elem.remove(child)
                continue
            self._fixupTspan(child)

    def effect(self):
        xs = self.svg.xpath('//*[name()="text"]')
        if isinstance(xs, list):
            for elem in list(xs):
                if not isTextElement(elem):
                    continue
                self._fixupTextElement(elem)


def trim(s: str) -> str:
    s = re.sub(r"^ +", "", s)
    s = re.sub(r" +$", "", s)
    s = re.sub(r"  +", " ", s)
    return s


if __name__ == "__main__":
    FixupTexts().run()
