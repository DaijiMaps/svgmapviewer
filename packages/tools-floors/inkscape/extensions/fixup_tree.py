import inkex

import daijimaps.address_tree
import daijimaps.map_layer


class FixupTree(daijimaps.address_tree.AddressTree):
    def _post_layers(self):
        for layer in self._layers:
            daijimaps.map_layer.fixup_tree_layer(layer)
            for child in list(layer):
                if isinstance(child, inkex.Group) and child.label == "Content":
                    daijimaps.map_layer.fixup_tree_layer_content(child)


if __name__ == "__main__":
    FixupTree().run()
