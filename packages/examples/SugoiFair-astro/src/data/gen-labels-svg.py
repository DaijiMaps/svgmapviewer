#!/usr/bin/env python3


import argparse
import json
import subprocess
import typing
import xml.etree.ElementTree as ET


####


class Box(typing.TypedDict):
    x: float
    y: float
    width: float
    height: float


class LabelTspan(typing.TypedDict):
    attrs: dict[str, str]
    text: str


class LabelText(typing.TypedDict):
    attrs: dict[str, str]
    children: list[LabelTspan]


####


viewbox: None | Box = None
texts: list[LabelText] = []
output_file: str = 'output_file.svg'


####


def expand_texts(input_file: str, output_file: str) -> None:
    p = subprocess.Popen(
        ["inkscape", "-T", input_file, "-o", output_file],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    stdout, stderr = p.communicate()


def write_svg() -> None:
    svg = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": f" {viewbox['x']} {viewbox['y']} {viewbox['width']} {viewbox['height']}"
    })

    for idx, text in enumerate(texts):
        a = text["attrs"]
        x = a["x"]
        y = a["y"]
        rotate = float(a["rotate"])
        scale2 = float(a["scale2"])
        scale1 = float(a["scale1"])
        dy = float(a["dy"])
        transform = f"translate({x}, {y}) rotate({rotate}) scale({scale2}) scale({scale1}) translate(0, {-dy})"
        text_ = ET.SubElement(svg, "text", {
            "font-family": a["font-family"],
            "font-weight": a["font-weight"],
            "font-size": a["font-size"],
            "text-anchor": a["text-anchor"],
            "transform": transform,
        })
        for j, tspan in enumerate(text['children']):
            a = tspan["attrs"]
            tspan_ = ET.SubElement(text_, "tspan", {
                "x": a["x"],
                "y": a["y"],
            })
            tspan_.text = tspan["text"]

    tree = ET.ElementTree(svg)
    ET.indent(tree, space="  ")
    tree.write(output_file + '.tmp', encoding="utf-8", xml_declaration=True)
    expand_texts(output_file + '.tmp', output_file)


def main() -> None:
    global viewbox
    global texts
    global output_file

    p = argparse.ArgumentParser()
    p.add_argument("-o", "--output-file", type=str, help='output file (e.g. "output_file.svg")')
    p.add_argument("layer", type=str, help='layer (e.g. "1F")')
    args = p.parse_args()

    if args.output_file is not None:
        output_file = args.output_file

    floors_labels_json = f"floors-labels-{args.layer}.json"

    with open("viewbox.json", "r", encoding="utf-8") as fh:
        viewbox = json.load(fh)
    with open(floors_labels_json, "r", encoding="utf-8") as fh:
        texts = json.load(fh)

    write_svg()


if __name__ == "__main__":
    main()
