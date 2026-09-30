import argparse
import csv
import json
import sys
import typing


use_prefix = False


name_to_addresses = {}


def collect_names_by_number(floor: str) -> None:
    global name_to_addresses

    idx_to_names = {}

    # 1. make idx => name mapping
    with open(f"names-{floor}.txt", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            idx = line.split(' ')[0]
            idx = int(idx)
            idx_to_names[idx] = line.strip()

    # 2. make idx => address mapping via number
    idx_to_addresses = {}
    with open("address-to-number.csv", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            (a, i) = line.strip().split(',')
            idx_to_addresses[int(i)] = f"A{floor}-Shops-{a}"

    # 3. make name => address mapping via number (2)
    name_to_addresses = {}
    for idx in idx_to_names:
        name = idx_to_names[idx]
        if idx in idx_to_addresses:
            addresses = idx_to_addresses[idx]
            print(f"{name} => {addresses}")
            name_to_addresses[name] = [addresses]


def collect_names_by_name(floor: str) -> None:
    global name_to_addresses

    # 4. make name => address mapping directly
    with open("address-to-name.csv", "r", encoding="utf-8") as fh:
        rows = csv.reader(fh, delimiter=',', quotechar='"')
        for row in rows:
            a = row[0]
            n = row[1]
            print(f"{n} => {a}")
            name_to_addresses.setdefault(n, []).append(a)


def write_floor_names(floor: str) -> None:
    #print(idx_to_names)
    #print(idx_to_addresses)
    #print(name_to_addresses)

    # 5. save name => address mapping
    with open(f"floors-names-{floor}.json", "w", encoding="utf-8") as fh:
        json.dump(name_to_addresses, fh, indent=2, ensure_ascii=False)


def handle_floors() -> None:
    with open(f"floors.json", "r", encoding="utf-8") as fh:
        floors = json.load(fh)
        for floor in floors:
            if use_prefix:
                collect_names_by_number(floor)
            else:
                collect_names_by_name(floor)
            write_floor_names(floor)


def main() -> None:
    global use_prefix
    p = argparse.ArgumentParser()
    p.add_argument("-p", "--use-prefix", action="store_true")
    args = p.parse_args()
    if args.use_prefix is not None:
        use_prefix = args.use_prefix

    handle_floors()


####


if __name__ == "__main__":
    main()
