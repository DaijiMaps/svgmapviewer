import typing

CONT = 0
SKIP = 1
EXIT = 2


type Cont = typing.Literal[0]
type Skip = typing.Literal[1]
type Exit = typing.Literal[2]
type Visit = Cont | Skip | Exit

def _visit_parents_inner(tree, parents, visitor):
    res = visitor(tree, parents)
    if (res == SKIP):
        return
    parents.append(tree)
    for child in list(tree):
        _visit_parents_inner(child, parents, visitor)
    parents.pop()


def _visit_parents(tree, visitor):
    _visit_parents_inner(tree, [], visitor)
