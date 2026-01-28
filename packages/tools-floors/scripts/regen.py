#!/usr/bin/env python3

import json
import os
import subprocess

DATA_DIR = "./src/data"
ASSETS_DIR = "./src/assets"

MAP_SVG = f"{DATA_DIR}/map.svg"

FLOORS_JSON = f"{DATA_DIR}/floors.json"

floors = {}

####

def xopenR(p):
    return open(p, 'r', encoding="utf-8")

def xopenW(p):
    return open(p, 'w', encoding="utf-8")

def xload(p):
    with xopenR(p) as f:
        return json.load(f)

def xdump(j, p):
    with xopenW(p) as f:
        json.dump(j, f, indent=2, ensure_ascii=False)

def split_floor_svg(floor: str, id: str) -> None:
    subprocess.run(['inkscape', '-jl', '-i', id, '-o', f"{ASSETS_DIR}/floor-{floor}.svg", MAP_SVG])

def fixup_floor_svg(floor: str) -> None:
    # XXX
    # XXX
    # XXX
    pass

####

def collect_floors():
    return xload(FLOORS_JSON)

def split_floors():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    for k, v in dict(floors).items():
        print(f"k={k} v={v}")
        id = v['contentId']
        split_floor_svg(k, id)
        fixup_floor_svg(k)

def collect_addresses():
    addresses = {}
    for floor in dict(floors):
        try:
            addresses[floor] = xload(f"{DATA_DIR}/floors-addresses-{floor}.json")
        except:
            continue
    xdump(addresses, f"{DATA_DIR}/floors-addresses.json")

def collect_names():
    names = {}
    for floor in dict(floors):
        try:
            names[floor] = xload(f"{DATA_DIR}/floors-names-{floor}.json")
        except:
            continue
    xdump(names, f"{DATA_DIR}/floors-names.json")

####

floors = collect_floors()
split_floors()
collect_addresses()
collect_names()
