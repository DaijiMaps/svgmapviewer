import inkex
from inkex.bezier import csparea
from inkex.elements import Use, Circle, Ellipse


def calc_area_as_path(elem):
    path = elem.to_path_element()
    csp = path.path.to_superpath()
    return abs(csparea(csp))


def calc_area(elem) -> tuple[float | None, float | None, float | None]:
    """Calculates the area of a shape, ellipse, rect, or a <use> clone element."""

    if isinstance(elem, Use):
        referenced_elem = elem.href
        if referenced_elem is None:
            return (None, None, None)
        tmp = referenced_elem.copy()
        tmp.transform = elem.transform @ referenced_elem.transform
    else:
        tmp = elem
    if not isinstance(tmp, (Circle, Ellipse)):
        return (None, None, None)
    a = calc_area_as_path(tmp)
    rx: float | None = None
    ry: float | None = None
    if isinstance(tmp, Circle):
        rx = tmp.get("r")
        ry = rx
    elif isinstance(tmp, Ellipse):
        rx = tmp.get("rx")
        ry = tmp.get("ry")
    return (a, rx, ry)


__all__ = [
    calc_area,
]
