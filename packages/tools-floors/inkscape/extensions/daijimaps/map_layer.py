import inkex


def fixup_tree_layer(group: inkex.Group) -> None:
    layer_names = [
        "(Names)",
        "(Unresolved Names)",
        "(Labels)",
        "(Unresolved Labels)",
        "Content",
        "(Background)",
    ]
    for layer_name in layer_names:
        find_layer_and_change_to_layer(group, layer_name)


def fixup_tree_layer_content(group: inkex.Group) -> None:
    layer_names: list[str] = [
        "(Labels)",
        "(Unresolved Labels)",
        "(Facilities)",
        "(Shops)",
        "Facilities",
        "Shops",
        "(Barriers)",
        "(Spaces)",
        "(Backgrounds)",
        "(Background)",
    ]
    for layer_name in layer_names:
        find_layer_and_change_to_layer(group, layer_name)


def find_layer_and_change_to_layer(group: inkex.Group, name: str) -> None:
    for child in list(group):
        if isinstance(child, inkex.Group) and child.label == name:
            group_to_layer(child)


def group_to_layer(group: inkex.Group) -> inkex.Layer:
    group_mode = group.get("inkscape:groupmode", None)
    if group_mode != "layer":
        group.set("inkscape:groupmode", "layer")
    return group


__all__: list[str] = ["fixup_tree_layer", "fixup_tree_layer_content"]
