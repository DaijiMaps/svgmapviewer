declare module 'validate-npm-package-name' {
  interface Result {
    validForNewPackages: boolean
    validForOldPackages: boolean
    warnings?: readonly string[]
    errors?: readonly string[]
  }

  function validate(name: string): Result

  export = validate
}
