import inkex
from typing import TypedDict


type Url = str

type AddressPosEntry = tuple[XY, inkex.BoundingBox, Url]
type AddressPos = dict[AddressString, AddressPosEntry]

type AddressString = str
type NameString = str
type XY = tuple[float, float]

type Address = tuple[AddressString | None, XY]
type Addresses = list[Address]
type NameAddresses = dict[NameString, Addresses]

type Name = tuple[AddressString, XY]
type Names = list[Name]
type AddressNames = dict[AddressString, Names]


class V(TypedDict):
    x: float
    y: float


type TmpAddressCoords = dict[AddressString, V]  # addresses.json
type TmpNameCoords = dict[NameString, list[V]]  # tmp_unresolved_addresses.json
type TmpNameAddress = dict[
    NameString, list[AddressString]
]  # tmp_resolved_addresses.json


# XXX
class FacilitiesJson(TypedDict):
    biLinks: dict[str, list[AddressString]]


__all__ = [
    # .address_tree
    Address,
    AddressNames,
    AddressPos,
    AddressPosEntry,
    AddressString,
    Addresses,
    FacilitiesJson,
    Name,
    NameAddresses,
    NameString,
    Names,
    TmpAddressCoords,
    TmpNameCoords,
    TmpNameAddress,
    Url,
    XY,
    V,
]  # type: ignore
