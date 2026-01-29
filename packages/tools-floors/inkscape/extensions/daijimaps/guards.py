from typing import Any, TypeGuard

import inkex


def isBaseElement(x: Any) -> TypeGuard[inkex.BaseElement]:
    return isinstance(x, inkex.BaseElement)


def isCircle(x: Any) -> TypeGuard[inkex.Circle]:
    return isinstance(x, inkex.Circle)


def isEllipse(x: Any) -> TypeGuard[inkex.Ellipse]:
    return isinstance(x, inkex.Ellipse)


def isGroup(x: Any) -> TypeGuard[inkex.Group]:
    return isinstance(x, inkex.Group)


def isRectangle(x: Any) -> TypeGuard[inkex.Rectangle]:
    return isinstance(x, inkex.Rectangle)


def isTextElement(x: Any) -> TypeGuard[inkex.TextElement]:
    return isinstance(x, inkex.TextElement)


def isTspan(x: Any) -> TypeGuard[inkex.Tspan]:
    return isinstance(x, inkex.Tspan)


def isUse(x: Any) -> TypeGuard[inkex.Use]:
    return isinstance(x, inkex.Use)


__all__ = [
    isBaseElement,
    isCircle,
    isEllipse,
    isGroup,
    isRectangle,
    isTextElement,
    isTspan,
    isUse,
]
