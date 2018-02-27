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

        // logging each node basic properties
        console.log(node.kind + " pos: " + node.pos + " end:" + node.end);

        // check if this nodes contains any comment
        let comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
        console.log(comments);

        // check if the node is a Block node TODO: extract info of block
        if (node.kind == ts.SyntaxKind.Block) {
            console.log("Block Found!");

            // TODO: extract the "@variation" from the comment using the comment.end and comment.start
            let x = sourceFile.text;
        }
        console.log("<======>\n");

        // check further nodes
        ts.forEachChild(node, checkVariabilityForNode);
    }

}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = ts.createSourceFile(fileName,
        readFileSync(fileName).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true);

    // check for variability identifiers
    checkVariability(sourceFile);
});