import inkex


# XXX show log?
def renumber_group(node: inkex.BaseElement):
    for idx, child in enumerate(list(node)):
        if not isinstance(child, inkex.Group):
            continue
        child.label = idx + 1


__all__ = [renumber_group]
