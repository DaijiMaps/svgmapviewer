#!/usr/bin/env python3

import argparse
import json
import os
import subprocess
import sys
import typing

DATA_DIR = "."
ASSETS_DIR = "../assets"

MAP_SVG = f"{DATA_DIR}/map.svg"

FLOORS_JSON = f"{DATA_DIR}/floors.json"

floors = {}

use_prefix = False

####


class Coord(typing.TypedDict):
    x: float
    y: float


class Address(typing.TypedDict):
    fidx: int
    coord: Coord


####


def eprint(*args, **kwargs):
    """Prints strings and objects directly to stderr."""
    kwargs["file"] = sys.stderr
    print(*args, **kwargs)


def unprefix(name: str) -> str:
    if use_prefix:
        words = name.strip().split(" ")
        return " ".join(words[1:])
    else:
        return name


def xopenR(p):
    return open(p, "r", encoding="utf-8")


def xopenW(p):
    return open(p, "w", encoding="utf-8")


def xload(p):
    with xopenR(p) as f:
        return json.load(f)


def xdump(j, p):
    with xopenW(p) as f:
        json.dump(j, f, indent=2, ensure_ascii=False)


def split_floor_svg(floor: str, id: str) -> None:
    subprocess.run(
        ["inkscape", "-j", "-i", id, "-o", f"{ASSETS_DIR}/floor-{floor}.svg", MAP_SVG]
    )


def fixup_floor_svg(floor: str) -> None:
    # XXX
    # XXX
    # XXX
    pass


####

floor_to_fidx = {}


def collect_floors():
    return xload(FLOORS_JSON)


def split_floors():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    for k, v in floors.items():
        eprint(f"splitting floors: {k}: {v}")
        eprint(f"k={k} v={v}")
        id = v["contentId"]
        split_floor_svg(k, id)
        fixup_floor_svg(k)


# astro src/content/addresses.json
def collect_addresses():
    floor_addresses = {}
    for floor in dict(floors):
        try:
            floor_addresses[floor] = xload(f"{DATA_DIR}/floors-addresses-{floor}.json")
        except ():
            continue
    all_addresses = {}
    for floor, addresses in floor_addresses.items():
        fidx = floor_to_fidx[floor]
        for address, data in addresses.items():
            a: Address = {
                "fidx": fidx,
                "coord": {
                    "x": data["x"],
                    "y": data["y"],
                },
            }
            all_addresses[address] = a
    xdump(all_addresses, f"{DATA_DIR}/astro-addresses.json")


# astro src/content/names.json
def collect_names():
    floor_names = {}
    for floor in dict(floors):
        try:
            path = f"{DATA_DIR}/floors-names-{floor}.json"
            eprint(f"loading {path}")
            floor_names[floor] = xload(path)
            eprint(f"floor_names: {floor}: {floor_names[floor]}")
        except ():
            continue
    all_names = {}
    for floor, names in floor_names.items():
        for name, addrs in names.items():
            eprint(f"name: {name}")
            name = unprefix(name)
            all_names.setdefault(name, []).extend(addrs)

    xdump(all_names, f"{DATA_DIR}/astro-names.json")


####


def main():
    global use_prefix

    p = argparse.ArgumentParser()
    p.add_argument("-p", "--use-prefix", action="store_true")
    args = p.parse_args()

    if args.use_prefix is not None:
        use_prefix = args.use_prefix
    eprint(f"use_prefix={use_prefix}")

    global floors
    global floor_to_fidx

    eprint("collecting floors")
    floors = collect_floors()
    eprint(f"floors: {floors}")
    for idx, name in enumerate(floors):
        eprint(f"floor: {idx}:{name}")
        floor_to_fidx[name] = idx
    split_floors()
    collect_addresses()
    collect_names()


if __name__ == "__main__":
    main()
