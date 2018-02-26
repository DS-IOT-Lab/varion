/**
 * Created by navid on 2/23/18.
 */
import {readFileSync} from "fs";
import * as ts from "typescript";

export function checkVariability(sourceFile: ts.SourceFile) {
    checkVariabilityForNode(sourceFile);

    // searches node comments and JSDocs for any variability identifiers
    function checkVariabilityForNode(node: ts.Node) {
        // TODO: search!
    }

}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);

    // check for variability identifiers
    checkVariability(sourceFile);
});