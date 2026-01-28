import inkex


class FixupFloorSvg(inkex.EffectExtension):
    def effect(self) -> None:
        xs = self.svg.xpath('/*/*/*[@*[name()="inkscape:label"]="Content"]')
        if isinstance(xs, list) and len(xs) == 1:
            content = xs[0]
            print(f'Content: {content}')
            if isinstance(content, inkex.Group):
                # 1. delete display:none
                floor = content.getparent()
                if isinstance(floor, inkex.Group):
                    print(f'del display')
                    del floor.style['display']

                # 2. remove Shops
                for child in list(content):
                    if child.label == 'Shops':
                        content.remove(child)


if __name__ == "__main__":
    FixupFloorSvg().run()
