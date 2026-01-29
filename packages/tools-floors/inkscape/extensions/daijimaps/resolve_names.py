import json
import os

import inkex
import inkex.command

from .common import a2astr, a2v, xy2v, V
from .name import read_name
from .save_addresses import SaveAddresses
from .types import (
    AddressNames,
    AddressString,
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
    # _tmp_unresolved_name_coords: TmpNameCoords = {}
    _tmp_resolved_names: TmpNameAddress = {}

    def _exec_resolve(self) -> str:
        exe: str = "%s/../resolve-addresses" % os.path.dirname(__file__)
        return inkex.command.call(
            exe,
            self._layerPaths["addresses"],
            self._layerPaths["tmpUnresolvedNames"],
            self._layerPaths["tmpResolvedNames"],
        )

    def _read_names(self, node: inkex.Group) -> tuple[NameAddresses, AddressNames]:
        name_addresses: NameAddresses = {}
        address_names: AddressNames = {}
        for child in list(node):
            if not isinstance(child, inkex.TextElement):
                # XXX msg
                continue
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
        p = self._layerPaths["tmpResolvedNames"]
        assert p is not None, "tmp resolved_names.json path is unspecified"
        with open(p, mode="r", encoding="utf-8") as f:
            # XXX
            # XXX
            # XXX
            # XXX validate
            self._tmp_resolved_names = json.load(f)
            # XXX
            # XXX
            # XXX

    def _get_tmp_unresolved_names(self) -> TmpNameCoords:
        j: TmpNameCoords = {}
        for name in self._unresolved_names:
            xys: list[V] = list(map(a2v, self._unresolved_names[name]))
            j[name] = xys
        return j

    def _get_floors_addresses(self) -> FloorsAddressesJson:
        j: FloorsAddressesJson = {}
        for astr in self._addresses:
            ((x, y), _bb, _url) = self._addresses[astr]
            j[astr] = xy2v(x, y)
        return j

    def _get_floors_names(self) -> FloorsNamesJson:
        j: FloorsNamesJson = {}
        for name in self._resolved_names:
            aa = self._resolved_names[name]
            xs: list[AddressString | None] = list(map(a2astr, aa))
            j[name] = [x for x in xs if x is not None]
        return j

    def _save_resolved_names(self) -> None:
        j: NameAddresses = self._resolved_names
        p = self._layerPaths["resolvedNames"]
        makedirsAndDump(p, j)

    def _save_unresolved_names(self) -> None:
        j: NameAddresses = self._unresolved_names
        p = self._layerPaths["unresolvedNames"]
        makedirsAndDump(p, j)

    def _save_tmp_unresolved_names(self) -> None:
        j: TmpNameCoords = self._get_tmp_unresolved_names()
        p = self._layerPaths["tmpUnresolvedNames"]
        makedirsAndDump(p, j)

    def _save_floors_addresses(self) -> None:
        j: FloorsAddressesJson = self._get_floors_addresses()
        p = self._layerPaths["floorsAddresses"]
        makedirsAndDump(p, j)

    def _save_floors_names(self) -> None:
        j: FloorsNamesJson = self._get_floors_names()
        p = self._layerPaths["floorsNames"]
        makedirsAndDump(p, j)

    def _find_group(self, layer, label) -> inkex.Group | None:
        for child in list(layer):
            self.msg(f"_find_group: {child.label}")
            if not isinstance(child, inkex.Group):
                # XXX msg
                continue
            if child.label is None or child.label != label:
                # XXX msg
                continue
            self.msg(f"_find_group: found: {child.label}")
            return child
        return None

    def _find_or_make_group(self, layer, label) -> inkex.Group:
        group = self._find_group(layer, label)
        if group is None:
            group = inkex.Group()
            group.label = label
            layer.append(group)
        return group

    def _prepare_names_group(self, layer) -> inkex.Group | None:
        names_group = self._find_or_make_group(layer, "(Names)")
        self.msg(f"_process_addresses: names {names_group}")
        if names_group is not None:
            self._read_resolved_names(names_group)
        else:
            self._resolved_names = {}
        return names_group

    def _prepare_unresolved_names_group(self, layer) -> inkex.Group | None:
        unresolved_names_group = self._find_or_make_group(layer, "(Unresolved Names)")
        self.msg(f"_process_addresses: unresolved_names {unresolved_names_group}")
        if unresolved_names_group is not None:
            self._read_unresolved_names(unresolved_names_group)
        else:
            self._unresolved_names = {}
        return unresolved_names_group

    def _resolve_names(self):
        self._save_tmp_unresolved_names()
        self._exec_resolve()
        self._load_tmp_resolved_names()


def makedirsAndDump(p: str, j: dict) -> None:
    d = os.path.dirname(p)
    os.makedirs(d, exist_ok=True)
    with open(p, mode="w", encoding="utf-8") as f:
        json.dump(j, f, indent=2, ensure_ascii=False)


__all__ = [ResolveNames]
