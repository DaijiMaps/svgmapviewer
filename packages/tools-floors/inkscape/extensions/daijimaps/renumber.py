import re

import inkex

import daijimaps


# XXX show log?
def renumber_group(node: inkex.Group):
    ngroups = 0
    nnongroups = 0
    nnames = 0
    m = re.compile("^[A-Z].*$")
    for child in list(node):
        if not daijimaps.isBaseElement(child):
            continue
        if isinstance(child, inkex.Group):
            ngroups = ngroups + 1
        else:
            nnongroups = nnongroups + 1
        label = child.label
        if label is not None and m.match(label):
            nnames = nnames + 1
    # non-mixed children => renumber children
    if (ngroups == 0 and nnames == 0) or (nnongroups == 0 and nnames == 0):
        for idx, child in enumerate(list(node)):
            if not daijimaps.isBaseElement(child):
                continue
            child.label = idx + 1
    # all children are group => recurse into children
    if nnongroups == 0:
        for child in list(node):
            if not daijimaps.isGroup(child):
                continue
            renumber_group(child)


__all__ = [renumber_group]
