import typing
from typing import Callable
import inkex


type Cont = typing.Literal[0]
type Skip = typing.Literal[1]
type Exit = typing.Literal[2]
type Visit = Cont | Skip | Exit

type Tree = inkex.Group
type Parents = list[inkex.Group]
type Visitor = Callable[[Tree, Parents], Visit]


CONT = 0
SKIP = 1
EXIT = 2


def _visit_parents_inner(tree: Tree, parents: Parents, visitor: Visitor) -> None:
    res = visitor(tree, parents)
    if res == SKIP:
        return
    parents.append(tree)
    for child in list(tree):
        _visit_parents_inner(child, parents, visitor)
    parents.pop()


def _visit_parents(tree: Tree, visitor: Visitor) -> None:
    _visit_parents_inner(tree, [], visitor)


__all__ = [Parents, Tree, Visit, Visitor, CONT, SKIP, EXIT, _visit_parents]
