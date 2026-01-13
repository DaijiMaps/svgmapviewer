from .types import Address, V


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


def a2v(axy: Address) -> V:
    (_a, (x, y)) = axy
    return xy2v(x, y)


__all__ = [a2v, xy2v]  # type: ignore
