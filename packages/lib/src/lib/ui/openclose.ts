type OpenClose = Readonly<{
  open: boolean
  animating: boolean
}>

type OpenCloseOp = typeof open

function reset(open: boolean): OpenClose {
  return { open, animating: false }
}

function open(prev: OpenClose): null | OpenClose {
  return prev.open || prev.animating
    ? null
    : {
        open: true,
        animating: true,
      }
}

function opened(prev: OpenClose): null | OpenClose {
  return !prev.open || !prev.animating
    ? null
    : {
        open: true,
        animating: false,
      }
}

function close(prev: OpenClose): null | OpenClose {
  return !prev.open || prev.animating
    ? null
    : {
        open: false,
        animating: true,
      }
}

function closed(prev: OpenClose): null | OpenClose {
  return prev.open || !prev.animating
    ? null
    : {
        open: false,
        animating: false,
      }
}

function isVisible({ open, animating }: OpenClose): boolean {
  return open || animating
}

export {
  close as openCloseClose,
  closed as openCloseClosed,
  isVisible as openCloseIsVisible,
  open as openCloseOpen,
  opened as openCloseOpened,
  reset as openCloseReset,
  type OpenClose,
  type OpenCloseOp,
}
