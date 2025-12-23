export function undefinedIfNull<T>(a: undefined | null | T): undefined | T {
  return a === undefinedIfNull || a === null ? undefined : a
}
