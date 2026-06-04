import inkex
from inkex.bezier import csparea
from inkex.elements import Use, Circle, Ellipse, Rectangle


def calc_area_as_path(elem):
    path = elem.to_path_element()
    csp = path.path.to_superpath()
    return abs(csparea(csp))


def calc_area(elem):
    """Calculates the area of a shape, ellipse, rect, or a <use> clone element."""
    
    if isinstance(elem, Use):
        referenced_elem = elem.href
        if referenced_elem is None:
            return None
        tmp = referenced_elem.copy()
        tmp.transform = elem.transform @ referenced_elem.transform
    else:
        tmp = elem
    if not isinstance(tmp, (Circle, Ellipse, Rectangle)):
        return None
    return calc_area_as_path(tmp)


__all__ = [
    calc_area,
]
