/**
 * Created by navid on 2/23/18.
 */

import {readFileSync} from "fs";
import * as ts from "typescript";

// TODO: find a proper name for variation point identifier instead of "variation"

export function checkVariability(sourceFile: ts.SourceFile) {
    checkVariabilityForNode(sourceFile);

    // searches node comments and JSDocs for any variability identifiers
    function checkVariabilityForNode(node: ts.Node) {
        console.log("<========>");
        console.log(node.kind + " pos: " + node.pos + " end:" + node.end);

        let comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
        console.log(comments);

        if (node.kind == ts.SyntaxKind.Block) {
            console.log("Block Found!");

            // TODO: extract the "@variation" from the comment using the comment.end and comment.start
            let x = sourceFile.text;
        }
        console.log("<======>\n");

        ts.forEachChild(node, checkVariabilityForNode);
    }

}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);

    // check for variability identifiers
    checkVariability(sourceFile);
});