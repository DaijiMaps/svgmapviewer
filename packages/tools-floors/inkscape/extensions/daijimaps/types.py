import inkex
from typing import TypedDict


class V(TypedDict):
    x: float
    y: float
    area: float | None


class Box(TypedDict):
    x: float
    y: float
    width: float
    height: float


type Url = str

# type AddressPosEntry = tuple[XY, inkex.BoundingBox, Url]
type AddressPosEntryV = tuple[V, inkex.BoundingBox, Url]
# type AddressPos = dict[AddressString, AddressPosEntry]
type AddressPosV = dict[AddressString, AddressPosEntryV]
type AddressArea = dict[AddressString, float]

# XXX XY for hashing
type XY = tuple[float, float]
type PosAddress = dict[XY, list[AddressString]]
# type PosAddressV = dict[V, list[AddressString]]

type AddressString = str
type NameString = str

# type Address = tuple[AddressString | None, XY]
type AddressV = tuple[AddressString | None, V]
# type Addresses = list[Address]
type AddressesV = list[AddressV]
# type NameAddresses = dict[NameString, Addresses]
type NameAddressesV = dict[NameString, AddressesV]

# type Name = tuple[NameString, XY]
type NameV = tuple[NameString, V]
# type Names = list[Name]
type NamesV = list[NameV]
# type AddressNames = dict[AddressString, Names]
type AddressNamesV = dict[AddressString, NamesV]


type AddressCoords = dict[AddressString, V]  # addresses.json

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


# XXX
class FloorsInfoJson(TypedDict):
    contentId: str


class TspanInfoJson(TypedDict):
    attrs: dict[str, str]
    text: str


class TextInfoJson(TypedDict):
    attrs: dict[str, str]
    children: list[TspanInfoJson]


#
# File paths
#
class JsonGlobalPaths(TypedDict):
    facilities: str
    floors: str
    origin: str
    viewbox: str
    bbox: str


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
    # Address,
    AddressV,
    AddressArea,
    # AddressNames,
    AddressNamesV,
    # AddressPos,
    # AddressPosEntry,
    AddressPosEntryV,
    AddressPosV,
    AddressString,
    # Addresses,
    AddressesV,
    Box,
    FacilitiesJson,
    FloorsInfoJson,
    JsonGlobalPaths,
    JsonLayerPaths,
    FloorsAddressesJson,
    FloorsNamesJson,
    Links,
    # Name,
    # NameAddresses,
    NameAddressesV,
    NameString,
    NameV,
    # Names,
    NamesV,
    AddressCoords,
    TextInfoJson,
    TmpNameCoords,
    TmpNameAddress,
    TspanInfoJson,
    Url,
    XY,
    V,
]
