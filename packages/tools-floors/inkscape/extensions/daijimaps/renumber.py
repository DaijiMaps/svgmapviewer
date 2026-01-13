import inkex


# XXX show log?
def renumber_group(node: inkex.BaseElement):
    for idx, child in enumerate(list(node)):
        child.label = idx + 1


__all__ = [renumber_group]  # type: ignore
