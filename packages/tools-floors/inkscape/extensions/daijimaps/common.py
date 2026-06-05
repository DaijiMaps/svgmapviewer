import os

from .types import AddressV, AddressString, V


# XXX prefer 1 to 1.0
def unround(n: float) -> float:
    f: float = round(n, ndigits=3)
    i: float = round(f)
    return f if f != i else i


def xy2v(x, y) -> V:
    return {
        "x": unround(x),
        "y": unround(y),
        "area": None,
        #'w': r3w if r3w != rw else rw,
    }


def a2astr(axy: AddressV) -> AddressString | None:
    (astr, _xy) = axy
    return astr


def a2v(axy: AddressV) -> V:
    (_a, v) = axy
    return v


def find_layer_file(dir: str, layer: str, prefix: str, suffix: str) -> str | None:
    ps: list[str] = [
        f"floors/{layer}/{prefix}.{suffix}",
        f"floors/{prefix}/{layer}.{suffix}",
        f"floors/{layer}-{prefix}.{suffix}",
        f"floors/{prefix}-{layer}.{suffix}",
        f"{layer}/{prefix}.{suffix}",
        f"{prefix}/{layer}.{suffix}",
        f"{layer}-{prefix}.{suffix}",
        f"{prefix}-{layer}.{suffix}",
    ]
    for p in ps:
        path: str = os.path.join(dir, p)
        if os.access(path, mode=os.R_OK):
            return path
    return None


__all__ = [a2astr, a2v, xy2v]
