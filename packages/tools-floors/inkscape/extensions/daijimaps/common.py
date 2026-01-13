from .types import Address, AddressString, V


# XXX prefer 1 to 1.0
def unround(n: float) -> float:
    f = round(n, 3)
    i = round(f)
    return f if f != i else i


def xy2v(x, y) -> V:
    return {
        "x": unround(x),
        "y": unround(y),
        #'w': r3w if r3w != rw else rw,
    }


def a2astr(axy: Address) -> AddressString | None:
    (astr, _xy) = axy
    return astr


def a2v(axy: Address) -> V:
    (_a, (x, y)) = axy
    return xy2v(x, y)


__all__ = [a2astr, a2v, xy2v]  # type: ignore
