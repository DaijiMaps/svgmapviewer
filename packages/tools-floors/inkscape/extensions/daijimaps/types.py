import inkex
from typing import TypedDict


type Url = str

type AddressPosEntry = tuple[XY, inkex.BoundingBox, Url]
type AddressPos = dict[AddressString, AddressPosEntry]
type PosAddress = dict[XY, list[AddressString]]

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
type LinkID = str
type Links = dict[LinkID, list[AddressString]]


# XXX
class FacilitiesJson(TypedDict):
    biLinks: Links


#
# JSON for svgmapviewer floors
#
type FloorsAddressesJson = dict[AddressString, V]  # floors-1F-addresses.json
type FloorsNamesJson = dict[NameString, list[AddressString]]  # floors-1F-names.json


#
# File paths
#
class JsonGlobalPaths(TypedDict):
    facilities: str


#
# Per-layer file paths
#
class JsonLayerPaths(TypedDict):
    addresses: str
    unresolvedNames: str
    resolvedNames: str
    tmpUnresolvedNames: str
    tmpResolvedNames: str
    floorsAddresses: str
    floorsNames: str


__all__ = [
    # .address_tree
    Address,
    AddressNames,
    AddressPos,
    AddressPosEntry,
    AddressString,
    Addresses,
    FacilitiesJson,
    JsonGlobalPaths,
    JsonLayerPaths,
    FloorsAddressesJson,
    FloorsNamesJson,
    Links,
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
]
