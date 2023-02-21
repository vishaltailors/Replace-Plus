const vscode = require('vscode');

function hasActiveEditor() {
	return vscode.window.activeTextEditor;
}

function hasSelections() {
	return vscode.window.activeTextEditor.selections.length > 0;
}

function activate() {
	console.log("Replace plus is now active!");
	vscode.commands.registerCommand('replace-plus.replaceWith', async function () {
		if(!hasActiveEditor()) {
			return;
		}
		if(!hasSelections()) {
			vscode.window.showErrorMessage("You must select something to replace.");
			return;
		}
		const input = await vscode.window.showInputBox({
			prompt: 'Provide a string separated by comma or array to replace with',
		})
		if(!input) {
			return;
		}
		let inputArr = input.split(',');
		if(input.charAt(0) == "[" && input.charAt(input.length - 1) == "]") {
			try{
				inputArr = JSON.parse(input);
			}catch(error) {
				vscode.window.showErrorMessage("OOPS! Make sure passed input is JSON parseable.");
				return;
			}
		}
		const editor = vscode.window.activeTextEditor;	
		editor.edit((editBuilder) => {
			editor.selections.forEach((selection, i) => {
				editBuilder.replace(selection, inputArr[i]);
			})
		})
	});

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
