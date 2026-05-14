import * as __rspack_external_vscode from 'vscode'
function activate(context) {
  console.log('Congratulations, your extension "svgpatheditor" is now active!')
  const disposable = __rspack_external_vscode.commands.registerCommand(
    'svgpatheditor.helloWorld',
    () => {
      __rspack_external_vscode.window.showInformationMessage(
        'Hello World from svgpatheditor!'
      )
      const panel = __rspack_external_vscode.window.createWebviewPanel(
        'catCoding',
        'Cat Coding',
        __rspack_external_vscode.ViewColumn.One
      )
      console.log(panel)
    }
  )
  context.subscriptions.push(disposable)
}
function deactivate() {}
export { activate, deactivate }

//# sourceMappingURL=extension.js.map
