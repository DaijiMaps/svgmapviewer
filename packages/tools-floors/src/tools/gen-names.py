import json


def gen_names(floor: str):
    # 1. make idx => name mapping
    idx_to_names = {}
    with open(f"names-{floor}.txt", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            idx = line.split(' ')[0]
            idx = int(idx)
            idx_to_names[idx] = line.strip()

    # 2. make idx => address mapping
    idx_to_addresses = {}
    with open("address-to-number.csv", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            (a, i) = line.strip().split(',')
            idx_to_addresses[int(i)] = f"A{floor}-Shops-{a}"

    # 3. make name => address mapping
    name_to_addresses = {}
    for idx in idx_to_names:
        name = idx_to_names[idx]
        if idx in idx_to_addresses:
            addresses = idx_to_addresses[idx]
            print(f"{name} => {addresses}")
            name_to_addresses[name] = [addresses]

    #print(idx_to_names)
    #print(idx_to_addresses)
    #print(name_to_addresses)

    # 4. save name => address mapping
    with open(f"floors-names-{floor}.json", "w", encoding="utf-8") as fh:
        json.dump(name_to_addresses, fh, indent=2, ensure_ascii=False)


####


floors = ["SUN"]


for floor in floors:
    gen_names(floor)
