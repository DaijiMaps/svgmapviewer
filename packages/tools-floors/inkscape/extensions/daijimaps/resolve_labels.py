import inkex
import inkex.command

from .resolve_names import ResolveNames

# from .save_addresses import SaveAddresses
from .types import (
    AddressNames,
)


class ResolveLabels(ResolveNames):
    # - read (Names)
    # - read (Unresolved Labels)
    # - match them by name

    _unresolved_labels: dict[str, inkex.TextElement] = {}
    _resolved_labels: dict[str, inkex.TextElement] = {}

    unresolved_labels: AddressNames = {}
    resolved_labels: AddressNames = {}

    def _resolve_labels(self) -> None:
        self.msg("=== resolve labels: start")
        self.msg("=== resolve labels: end")

    def _read_unresolved_labels(self, node: inkex.Group) -> None:
        for child in list(node):
            if not isinstance(child, inkex.TextElement):
                # XXX msg
                continue
            name = child.get("inkscape:label")
            if not name:
                self.msg(f"loading (Unresolved Labels): {child.label}: failed")
                continue
            if name in self._unresolved_labels:
                self.msg(f"duplicate label: {name}")
                continue
            self._unresolved_labels[name] = child

    def _read_resolved_labels(self, node: inkex.Group) -> None:
        for child in list(node):
            if not isinstance(child, inkex.TextElement):
                # XXX msg
                continue
            if not child.label:
                self.msg(f"loading (Labels): {child}: failed")
                continue
            name = child.label.split(" @ ")[0]
            if name in self._resolved_labels:
                self.msg(f"duplicate label: {name}")
                continue
            self._resolved_labels[name] = child

    def _prepare_unresolved_labels_group(self, layer) -> None | inkex.Group:
        unresolved_labels_group = self._find_or_make_group(layer, "(Unresolved Labels)")
        if unresolved_labels_group is not None:
            self._read_unresolved_labels(unresolved_labels_group)
        return unresolved_labels_group

    def _prepare_labels_group(self, layer) -> None | inkex.Group:
        labels_group = self._find_or_make_group(layer, "(Labels)")
        if labels_group is not None:
            self._read_resolved_labels(labels_group)
        return labels_group
