/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "svgpatheditor" is now active!')

  const disposable = vscode.commands.registerCommand(
    'svgpatheditor.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from svgpatheditor!')
      const panel = vscode.window.createWebviewPanel(
        'catCoding',
        'Cat Coding',
        vscode.ViewColumn.One
      )
      console.log(panel)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
