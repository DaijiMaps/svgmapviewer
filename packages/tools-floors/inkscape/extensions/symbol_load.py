#!/usr/bin/env python3
# coding=utf-8

import inkex



class SymbolLoad(inkex.EffectExtension):
    _symbol_name = ''
    _symbol_content = None
    _symbol_node = None

    def _replace_symbol(self):
        content = self._symbol_content
        node = self._symbol_node

        if not (content is not None and node is not None):
            self.msg(f"Something is wrong!")
            return False

        self.msg(f"Loading the new symbol {self._symbol_name}!")

        content.delete()
        node.remove_all()
        # XXX why node.add(list) does not work?
        for c in list(content):
            self.msg(f"appending {c}...")
            node.append(c)

        return True

    def _find_symbol_for_replace(self):
        name = self._symbol_name

        sym = self.svg.getElementById(f"#{name}")
        if sym is None:
            self.msg(f"Target <symbol> (#{name}) not found!")
            return False
        
        if sym.tag_name != "symbol":
            self.msg(f"Not a <symbol> tag!")
            return False

        self._symbol_node = sym

        return True

    def _check_group_for_replace(self, node):
        if not isinstance(node, inkex.Group):
            self.msg(f"Group must be selected!")
            return False

        name = node.label
        if name is None:
            self.msg(f"Symbol name must be defined as label!")
            return False

        children = list(node)

        if len(children) != 2:
            self.msg(f"Group must exactly contain <use> and <g>!")
            return False

        orig = children[0]

        if not isinstance(orig, inkex.Use):
            self.msg(f"Group must exactly contain <use> and <g>!")
            return False
        
        if not orig.href:
            self.msg(f"no href found")
            return False

        href = f"#{orig.href.get_id()}"

        if href != f"#{name}":
            self.msg(f"Group name ({name}) does not match <use> symbol name ({href})!")
            return False

        content = children[1]

        if not isinstance(content, inkex.Group):
            self.msg(f"The target is not a Group!")
            return False
        
        self._symbol_name = name
        self._symbol_content = content

        return True

    def effect(self):
        if self.svg.selection:
            for node in self.svg.selection.values():
                if self._check_group_for_replace(node):
                    if self._find_symbol_for_replace():
                        self._replace_symbol()


if __name__ == "__main__":
    SymbolLoad().run()
