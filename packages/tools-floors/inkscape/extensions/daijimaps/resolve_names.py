import json
import os

import inkex
import inkex.command

from .common import a2astr, a2v, xy2v
from .name import read_name
from .save_addresses import SaveAddresses
from .types import (
    AddressNames,
    FloorsAddressesJson,
    FloorsNamesJson,
    NameAddresses,
    TmpNameAddress,
    TmpNameCoords,
)


class ResolveNames(SaveAddresses):
    _resolved_names: NameAddresses = {}
    _resolved_addresses: AddressNames = {}
    _unresolved_names: NameAddresses = {}
    _unresolved_addresses: AddressNames = {}
    _tmp_unresolved_name_coords: TmpNameCoords = {}
    _tmp_resolved_names: TmpNameAddress = {}

    def _exec_resolve(self) -> str:
        exe = "%s/../resolve-addresses" % os.path.dirname(__file__)
        return inkex.command.call(
            exe,
            self._addresses_json,
            self._tmp_unresolved_names_json,
            self._tmp_resolved_names_json,
        )

    def _remove_children(self, node) -> None:
        for child in list(node):
            node.remove(child)

    def _read_names(self, node: inkex.Group) -> tuple[NameAddresses, AddressNames]:
        name_addresses: NameAddresses = {}
        address_names: AddressNames = {}
        for child in list(node):
            shop = read_name(child)
            if not shop:
                self.msg(f"loading (Names): {child.label}: failed")
                continue
            (address, name, xy) = shop
            # name -> (address, xy)
            # address can be None
            if name not in name_addresses:
                name_addresses[name] = []
            name_addresses[name].append((address, xy))
            # address -> (name, xy)
            # address must not be None
            if address is None:
                self.msg(f"skipping a resolved name without address: {name}")
                continue
            if address not in address_names:
                address_names[address] = []
            address_names[address].append((name, xy))

        return (name_addresses, address_names)

    def _read_resolved_names(self, node: inkex.Group) -> AddressNames:
        (name_addresses, address_names) = self._read_names(node)
        self._resolved_names = name_addresses
        self._resolved_addresses = address_names
        return address_names

    def _read_unresolved_names(self, node: inkex.Group) -> NameAddresses:
        (name_addresses, address_names) = self._read_names(node)
        self._unresolved_names = name_addresses
        self._unresolved_addresses = address_names
        return name_addresses

    def _load_tmp_resolved_names(self) -> None:
        assert self._tmp_resolved_names_json is not None, (
            "tmp resolved_names.json path is unspecified"
        )
        with open(self._tmp_resolved_names_json, "r", encoding="utf-8") as f:
            # XXX
            # XXX
            # XXX
            # XXX validate
            self._tmp_resolved_names = json.load(f)
            # XXX
            # XXX
            # XXX

    def _save_resolved_names(self) -> None:
        self.msg(f"saving resolved names json: {self._resolved_names}")
        assert self._resolved_names_json is not None, (
            "_resolved_names_json path is unspecified"
        )
        d = os.path.dirname(self._resolved_names_json)
        os.makedirs(d, exist_ok=True)
        with open(self._resolved_names_json, "w", encoding="utf-8") as f:
            json.dump(self._resolved_names, f, indent=2, ensure_ascii=False)

    def _save_unresolved_names(self) -> None:
        self.msg(f"saving unresolved names json: {self._unresolved_names}")
        assert self._unresolved_names_json is not None, (
            "_unresolved_names_json path is unspecified"
        )
        d = os.path.dirname(self._unresolved_names_json)
        os.makedirs(d, exist_ok=True)
        with open(self._unresolved_names_json, "w", encoding="utf-8") as f:
            json.dump(self._unresolved_names, f, indent=2, ensure_ascii=False)

    def _save_tmp_unresolved_names(self) -> None:
        self.msg(f"saving tmp unresolved names json: {self._unresolved_names}")
        assert self._tmp_unresolved_names_json is not None, (
            "_tmp_unresolved_names_json path is unspecified"
        )

        self._tmp_unresolved_name_coords = {}
        for name in self._unresolved_names:
            xys = list(map(a2v, self._unresolved_names[name]))
            self._tmp_unresolved_name_coords[name] = xys

        d = os.path.dirname(self._tmp_unresolved_names_json)
        os.makedirs(d, exist_ok=True)
        with open(self._tmp_unresolved_names_json, "w", encoding="utf-8") as f:
            json.dump(self._tmp_unresolved_name_coords, f, indent=2, ensure_ascii=False)

    def _save_floors_addresses(self) -> None:
        j: FloorsAddressesJson = {}
        for a in self._addresses:
            ((x, y), _bb, _url) = self._addresses[a]
            j[a] = xy2v(x, y)
        assert self._floors_addresses_json is not None, (
            "floors addresses json path is unspecified"
        )
        d = os.path.dirname(self._floors_addresses_json)
        os.makedirs(d, exist_ok=True)
        with open(self._floors_addresses_json, "w", encoding="utf-8") as f:
            json.dump(j, f, indent=2, ensure_ascii=False)

    def _save_floors_names(self) -> None:
        j: FloorsNamesJson = {}
        for name in self._resolved_names:
            aa = self._resolved_names[name]
            xs = [x for x in list(map(a2astr, aa)) if x is not None]
            j[name] = xs

        assert self._floors_names_json is not None, (
            "floors names json path is unspecified"
        )
        d = os.path.dirname(self._floors_names_json)
        os.makedirs(d, exist_ok=True)
        with open(self._floors_names_json, "w", encoding="utf-8") as f:
            json.dump(j, f, indent=2, ensure_ascii=False)

    def _find_group(self, layer, label) -> inkex.Group | None:
        for child in list(layer):
            self.msg(f"_find_group: {child.label}")
            if not isinstance(child, inkex.Group):
                continue
            if child.label is None or child.label != label:
                continue
            self.msg(f"_find_group: found: {child.label}")
            return child
        return None

    def _prepare_names_group(self, layer) -> inkex.Group | None:
        names_group = self._find_group(layer, "(Names)")
        self.msg(f"_process_addresses: names {names_group}")
        if names_group is not None:
            self._read_resolved_names(names_group)
        else:
            self._resolved_names = {}
        return names_group

    def _prepare_unresolved_names_group(self, layer) -> inkex.Group | None:
        unresolved_names_group = self._find_group(layer, "(Unresolved Names)")
        self.msg(f"_process_addresses: unresolved_names {unresolved_names_group}")
        if unresolved_names_group is not None:
            self._read_unresolved_names(unresolved_names_group)
        else:
            self._unresolved_names = {}
        return unresolved_names_group


__all__ = [ResolveNames]  # type: ignore
