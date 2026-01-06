# Inkscape extensions for DaijiMaps

- renumber_group
- TODO renumber_tree
- TODO assign_addresses
- TODO unlabel_group, unlabel_tree

- TODO validation
- TODO fixup
- TODO classification
  - define classes (e.g. shops, facilities, shop, address, scale, symbol, ...)
  - use Classes (e.g. `node.classes.append('shop')`)

## renumber_tree

- Skip pattern (`/^[A-Z].*$/`)
- Terminal condition (`node.get('transform')`)

## assign_addresses

- e.g. `F1F-Shops-N-1-1`
- delimiter (`-`)
- Omit pattern (e.g. `Floor`)
  - 1F/Floor/Shops/... => `1F-Shops-...`
- Skip pattern (e.g. `Background`)
  - 1F/Background is skipped/ignored
- prefix, suffix

## symbol_load

- <g label="Toilets_Inv">
  - <use href="#Toilets_Inv">
  - <g>
    - ...
