export type Mod = {
  shift: boolean
  alt: boolean
  control: boolean
}

export const modSet = (
  { shift, alt, control }: Readonly<Mod>,
  key: string
): Mod => ({
  shift: key === 'Shift' ? true : shift,
  alt: key === 'Alt' ? true : alt,
  control: key === 'Control' ? true : control,
})

export const modClr = (
  { shift, alt, control }: Readonly<Mod>,
  key: string
): Mod => ({
  shift: key === 'Shift' ? false : shift,
  alt: key === 'Alt' ? false : alt,
  control: key === 'Control' ? false : control,
})
