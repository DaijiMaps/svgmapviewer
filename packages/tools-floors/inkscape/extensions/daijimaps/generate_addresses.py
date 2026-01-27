import inkex

from .save_addresses import SaveAddresses


class GenerateAddresses(SaveAddresses):
    _group_label = "(Addresses)"

    def _cleanup_addresses(self, layer) -> None:
        for child in list(layer):
            if child.label == self._group_label:
                child.delete()

    def _generate_addresses_address(self, aparent, k, x, y, bb, href) -> None:
        pass

    def _generate_addresses(self, layer) -> None:
        self.msg("=== GenerateAddresses: _generate_addresses")
        if len(self._addresses.items()) == 0:
            self.msg("_generate_addresses: no items found!")
            return

        aparent = inkex.Group()
        aparent.label = self._group_label
        for k, ((x, y), bb, href) in self._addresses.items():
            self._generate_addresses_address(aparent, k, x, y, bb, href)
        layer.append(aparent)

    def _pre_process_addresses(self, layer: inkex.Group) -> None:
        super()._pre_process_addresses(layer)
        self._cleanup_addresses(layer)

    def _process_addresses(self, layer: inkex.Group) -> None:
        self.msg("=== GenerateAddresses: _process_addresses")
        super()._process_addresses(layer)
        self._generate_addresses(layer)


__all__ = [GenerateAddresses]  # type: ignore
