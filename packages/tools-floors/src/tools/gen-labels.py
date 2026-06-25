import argparse
import html
import io
import json
import math
import re
import subprocess
import sys
import typing


####


type BB = tuple[float, float, float, float]


####


FONT_SIZE = 16  # px
LINE_HEIGHT = 1.25

TEXT_ID_LINE_RE = re.compile("text[0-9]+,")  # inkscape -S output
TEXT_ID_RE = re.compile("text([0-9]+)")
TSPAN_ID_LINE_RE = re.compile("tspan[0-9]+,")  # inkscape -S output
TSPAN_ID_RE = re.compile("tspan([0-9]+)")


####


circle_area = 1
font_size = FONT_SIZE
line_height = LINE_HEIGHT
output_json = False
use_prefix = False
no_wrap = False


####


name_to_pat: dict[str, str] = {}
name_to_spans: dict[str, list[str]] = {}

names: dict[str, list[str]] = {}

boundingboxes: dict[str, BB] = {}
idx_to_numbered_name: dict[int, str] = {}
idx_to_boundingboxes: dict[int, BB] = {}
idx_to_scale: dict[int, float] = {}
idx_to_dy: dict[int, float] = {}
idx_to_area: dict[int, float] = {}


####


def eprint(*args, **kwargs):
    """Prints strings and objects directly to stderr."""
    kwargs["file"] = sys.stderr
    print(*args, **kwargs)


def pat_to_spans(pat: str) -> str:
    words = pat.strip().split(" ")
    spans = map(lambda w: w.replace("___", " "), words)
    return "///".join(spans)


# read names and output patterns that needs fixups
#
# INPUT:
# グランドセイコー
#
# OUTPUT:
# グランドセイコー@@@グランド///セイコー
#
# where split-patterns.txt has
# グランドセイコー@@@グランド セイコー
def gen_labels(names_txt: str) -> None:
    num_to_name = {}
    name_to_pat = {}

    with open("split-patterns.txt", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            xs = line.strip().split("@@@")
            if len(xs) != 2:
                continue
            name = xs[0]
            pat = xs[1]
            if name == pat:
                continue
            eprint(f"PAT: {name} => {pat}")
            name_to_pat[name] = pat

    with open(names_txt, "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            words = line.strip().split(" ")
            num = words[0] if use_prefix else " ".join(words)
            name = " ".join(words[1:])
            eprint(f"NUM: {num} => {name}")
            num_to_name[num] = name

    with open("/tmp/names-patterns.txt", "w", encoding="utf-8") as fh:
        names = {}
        for num, name in num_to_name.items():
            # print(f"name={name}")
            if name in names:
                continue
            names[name] = 1
            if name in name_to_pat:
                pat = name_to_pat[name]
                fh.write(f"{name}@@@{pat_to_spans(pat)}\n")


####


def make_patterns(names_txt: str) -> None:
    gen_labels(names_txt)

    with open("/tmp/names-patterns.txt", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            (name, pat) = line.strip().split("@@@")
            spans = pat.split("///")
            name_to_pat[name] = pat
            name_to_spans[name] = spans


def make_idxs(names_txt: str) -> None:
    with open(names_txt, "r", encoding="utf-8") as fh:
        for idx, line in enumerate(fh.readlines()):
            numbered_name = line.strip()
            idx_to_numbered_name[idx] = numbered_name
            eprint(f"IDX: {idx} => {numbered_name}")


def get_name(idx) -> None | str:
    numbered_name = idx_to_numbered_name[idx]
    numbered_words = numbered_name.split(" ")
    # if len(numbered_words) < 2:
    #    None
    # heads = [numbered_words[0]] if use_prefix else []
    words = numbered_words[1:] if use_prefix else numbered_words
    name = " ".join(words)
    # print('XXX get_name', idx, ':::', words, ':::', name)
    return name


def get_num_spans(numbered_name: str) -> list[str]:
    # numbered_name = idx_to_numbered_name[idx]
    numbered_words = numbered_name.split(" ")
    # if len(numbered_words) < 2:
    #    None
    heads = [numbered_words[0]] if use_prefix else []
    words = numbered_words[1:] if use_prefix else numbered_words
    name = " ".join(words)
    spans = words if name not in name_to_spans else name_to_spans[name]
    res = heads + spans
    if no_wrap:
        res = [" ".join(res)]
        print("res", res, file=sys.stderr)
    return res


def write_svg_header(fh: typing.TextIO) -> None:
    fh.write(f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" viewBox="-150 -150 300 300">
<style>text {{ font-family: "sans-serif"; font-size: {font_size}px; }}</style>
<circle id="circle1" fill="none" stroke="red" stroke-width="0.1px" cx="0" cy="0" r="{font_size * 5 / 2}"/>
<path fill="none" stroke="blue" stroke-width="0.1px" d="M-100,0 h200 M0,-100 v200"/>
""")


def write_svg_footer(fh: typing.TextIO) -> None:
    fh.write("</svg>\n")


word_to_idx = {}
word_idx_to_boundingboxes: dict[int, BB] = {}


def make_tmp_svg() -> None:
    with open("/tmp/gen-labels-names.svg", "w", encoding="utf-8") as fh:
        write_svg_header(fh)
        word_idx = 0
        for idx, numbered_name in idx_to_numbered_name.items():
            spans = get_num_spans(numbered_name)
            if spans is None:
                continue
            fh.write(f"<text id='text{idx}' text-anchor='middle'>\n")
            for i, word in enumerate(spans):
                fh.write(
                    f"<tspan id='tspan{word_idx}' x='0' y='{LINE_HEIGHT * i}em'>{html.escape(word)}</tspan>\n"
                )
                word_to_idx[word] = word_idx
                word_idx = word_idx + 1
            fh.write("</text>\n")
        write_svg_footer(fh)


def get_bboxes() -> None:
    p = subprocess.Popen(
        ["inkscape", "-S", "/tmp/gen-labels-names.svg"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    stdout, stderr = p.communicate()

    for line in stdout.strip().split("\n"):
        (id, x, y, w, h) = line.strip().split(",")
        bb = (float(x), float(y), float(w), float(h))
        boundingboxes[id] = bb
        m = TEXT_ID_RE.match(id)
        if m is not None:
            idx = int(m[1])
            idx_to_boundingboxes[idx] = bb
        m = TSPAN_ID_RE.match(id)
        if m is not None:
            word_idx = int(m[1])
            word_idx_to_boundingboxes[word_idx] = bb


def calc_params() -> None:
    (cx, cy, cw, ch) = boundingboxes["circle1"]
    # ox = cx + cw / 2
    oy = cy + ch / 2

    for idx in idx_to_boundingboxes:
        numbered_name = idx_to_numbered_name[idx]
        (x, y, w, h) = idx_to_boundingboxes[idx]
        a = w * h
        # r = w / h

        spans = get_num_spans(numbered_name)
        if spans is None:
            continue
        total_sa: float = 0
        for word in spans:
            word_idx = word_to_idx[word]
            (sx, sy, sw, sh) = word_idx_to_boundingboxes[word_idx]
            sa = sw * sh
            # print(f"{word}: sa = {sa}", file=sys.stderr)
            total_sa = total_sa + sa
            # sr = sw / sh

        # print(f"{numbered_name}: a = {a}; sa = {total_sa}", file=sys.stderr)
        if total_sa != 0:
            a = total_sa

        # if a > circle_area:
        #    pass # print(f"bb too big: numbered_name={numbered_name} a={a}")
        # if r > 3:
        #    pass # print(f"bb too wide: numbered_name={numbered_name} r={r}")
        # if r < 1 / 2:
        #    pass # print(f"bb too tall: numbered_name={numbered_name} r={r}")

        s = a / circle_area

        # cx = (x - ox) + w / 2
        cy = (y - oy) + h / 2

        idx_to_scale[idx] = 1 / s
        idx_to_dy[idx] = cy
        idx_to_area[idx] = circle_area


def write_scaled_names_svg() -> None:
    with open("/tmp/scaled-names.svg", "w", encoding="utf-8") as fh:
        write_svg_header(fh)
        for idx, numbered_name in idx_to_numbered_name.items():
            spans = get_num_spans(numbered_name)
            s = math.sqrt(idx_to_scale[idx])
            dy = idx_to_dy[idx]
            fh.write(
                f"<text id='text{idx}' text-anchor='middle' transform='scale({s}) translate(0, {round(-dy, 2)})'>\n"
            )
            for i, word in enumerate(spans):
                fh.write(f"<tspan x='0' y='{LINE_HEIGHT * i}em'>{word}</tspan>\n")
            fh.write("</text>\n")
        write_svg_footer(fh)


class Label(typing.TypedDict):
    name: str
    pat: str
    s: float
    dy: float
    area: float


def write_scaled_names_txt() -> None:
    labels: list[Label] = []
    ys: list[str] = []
    for idx in idx_to_numbered_name:
        numbered_name = idx_to_numbered_name[idx]
        name = get_name(idx)
        pat = name_to_pat[name] if name in name_to_pat else ""
        s = math.sqrt(idx_to_scale[idx])
        # XXX
        # XXX
        # XXX
        s = math.sqrt(s)
        # XXX
        # XXX
        # XXX
        dy = idx_to_dy[idx]
        area = idx_to_area[idx]
        label: Label = {
            "name": numbered_name,
            "pat": pat,
            "s": round(s, 2),
            "dy": round(dy, 2),
            "area": round(area, 2),
        }
        labels.append(label)
    if not output_json:
        for label in labels:
            # XXX area
            xs = [label["name"], label["pat"], str(label["s"]), str(label["dy"])]
            ys.append("@@@".join(xs))
        print("\n".join(ys))
    else:
        if isinstance(sys.stdout, io.TextIOWrapper):
            sys.stdout.reconfigure(encoding="utf-8")
        json.dump(labels, sys.stdout, ensure_ascii=False, indent=2)


def calc_bb(names_txt: str) -> None:
    make_patterns(names_txt)
    make_idxs(names_txt)
    make_tmp_svg()
    get_bboxes()
    calc_params()
    write_scaled_names_svg()
    write_scaled_names_txt()


####


def main() -> None:
    global font_size
    global output_json
    global line_height
    global use_prefix
    global no_wrap

    p = argparse.ArgumentParser()
    p.add_argument("names_txt", type=str, help="names-XXX.txt")
    p.add_argument("-f", "--font-size", type=float)
    p.add_argument("-j", "--json", action="store_true")
    p.add_argument("-l", "--line-height", type=float)
    p.add_argument("-p", "--prefix", action="store_true")
    p.add_argument("-w", "--no-wrap", action="store_true")
    args = p.parse_args()

    if args.font_size is not None:
        font_size = args.font_size
    if args.json is not None:
        output_json = args.json
    if args.prefix is not None:
        use_prefix = args.prefix
    if args.line_height is not None:
        line_height = line_height
    if args.no_wrap is not None:
        eprint("no_wrap!")
        no_wrap = args.no_wrap

    # 5em circle
    global circle_area
    circle_area = pow(font_size * 5 / 2, 2) * 3.14

    calc_bb(args.names_txt)


if __name__ == "__main__":
    main()
