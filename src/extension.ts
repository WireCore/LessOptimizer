'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { Z_DEFAULT_COMPRESSION } from 'zlib';

export function activate(context: vscode.ExtensionContext) {

	const collection = vscode.languages.createDiagnosticCollection('test');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	}));
}

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {

	let doctext = document.getText();
	let doclines = doctext.split("\n");

	let foundedClasses = Array<DocumentElement>();
	let foundedIds = Array<DocumentElement>();

	doclines.forEach(function(value,index){

		let checkClasses = value.match(/(\.)(.*)({)/);

		if(checkClasses != null){

			let docElem:DocumentElement = new DocumentElement();
			docElem.name = checkClasses[0];
			docElem.startPoint = value.indexOf(".");
			docElem.endPoint = value.indexOf("{");
			docElem.lineNumber = index;
			docElem.type = "class";

			foundedClasses.push(docElem);
		}

		let checkIds = value.match(/(\#)(.*)({)/);

		if(checkIds != null){
			let docElem:DocumentElement = new DocumentElement();
			docElem.name = checkIds[0];
			docElem.startPoint = value.indexOf("#");
			docElem.endPoint = value.indexOf("{");
			docElem.lineNumber = index;
			docElem.type = "id";

			foundedIds.push(docElem);
		}

	});

	let duplicates:any = Array<Object>();

	let checkedClasses = Array<DocumentElement>();
	foundedClasses.forEach(function(value,index){

		checkedClasses.forEach(function(value2,index2){
			if(value2.name == value.name){
				let diagnostic1 = new Object({
					code: '',
					message: 'Duplicate Class Found',
					range: new vscode.Range(new vscode.Position(value.lineNumber, value.startPoint), new vscode.Position(value.lineNumber, value.endPoint)),
					severity: vscode.DiagnosticSeverity.Warning,
					source: '',
					relatedInformation: [
						new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
					]
				});
				let diagnostic2 = new Object({
					code: '',
					message: 'Duplicate Class Found',
					range: new vscode.Range(new vscode.Position(value2.lineNumber, value2.startPoint), new vscode.Position(value2.lineNumber, value2.endPoint)),
					severity: vscode.DiagnosticSeverity.Warning,
					source: '',
					relatedInformation: [
						new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
					]
				});
				duplicates.push(diagnostic1);
				duplicates.push(diagnostic2);
			}
		});

		checkedClasses.push(value);

	});

	let checkedIds = Array<DocumentElement>();
	foundedIds.forEach(function(value,index){

		checkedIds.forEach(function(value2,index2){
			if(value2.name == value.name){
				let diagnostic1 = new Object({
					code: '',
					message: 'Duplicate Class Found',
					range: new vscode.Range(new vscode.Position(value.lineNumber, value.startPoint), new vscode.Position(value.lineNumber, value.endPoint)),
					severity: vscode.DiagnosticSeverity.Warning,
					source: '',
					relatedInformation: [
						new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
					]
				});
				let diagnostic2 = new Object({
					code: '',
					message: 'Duplicate Class Found',
					range: new vscode.Range(new vscode.Position(value2.lineNumber, value2.startPoint), new vscode.Position(value2.lineNumber, value2.endPoint)),
					severity: vscode.DiagnosticSeverity.Warning,
					source: '',
					relatedInformation: [
						new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
					]
				});
				duplicates.push(diagnostic1);
				duplicates.push(diagnostic2);
			}
		});

		checkedIds.push(value);

	});

	collection.clear();
	collection.set(document.uri,duplicates);

	// show message
	/*duplicates.forEach(function(value,index){
		collection.set(document.uri, duplicates);
	});*/

	//let foundedClasses = doctext.match(/(\.)(.*)({)/);
	//let foundedIds = doctext.match(/(\#)(.*)({)/);

	// regex for classes (\.)(.*)({)
	// regex for ids (\#)(.*)({)

	// show duplicates

	
	/*if (document && path.basename(document.uri.fsPath) === 'sample-demo.rs') {
		collection.set(document.uri, [{
			code: '',
			message: 'cannot assign twice to immutable variable `x`',
			range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
			severity: vscode.DiagnosticSeverity.Warning,
			source: '',
			relatedInformation: [
				new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
			]
		}]);
	} else {
		collection.clear();
	}*/
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class DocumentElement {
	
	public type:String = "class";
	public name:String = "";
	public startPoint:number = 0;
	public endPoint:number = 0;
	public lineNumber:number = 0;

}