/**
 * Created by navid on 2/23/18.
 */

import {readFileSync} from "fs";
import * as ts from "typescript";
import {isUndefined} from "util";
import * as doctrine from "doctrine";


/*
1- TODO: find a proper name for variation point identifier instead of "variation"
2- TODO: install Bool boolean expression parser and integrate with project!
3- TODO: find a way for code elimination.
 */

export function checkVariability(sourceFile: ts.SourceFile) {
    checkVariabilityForNode(sourceFile);


    /**
     * searches node comments and JSDocs for any variability identifiers.
     * @param node
     */
    function checkVariabilityForNode(node: ts.Node) {
        searchInJSDoc(node);

        searchInComments(node)
    }

    /**
     * This function searches for information in the
     * single line comments.
     * @param node
     */
    function searchInComments(node: ts.Node) {
        // check if this nodes contains any comment
        let comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos);

        // check if the node is a Block node
        if (node.kind == ts.SyntaxKind.Block) {
            console.log("<---- Block Found ---->");


            // logging each node basic properties
            console.log("Block info: ");
            console.log(node.kind + " pos: " + node.pos + " end:" + node.end);

            let sourceText = sourceFile.text;

            extractInfoFromSingleLineComment(comments, sourceText);

            console.log("<---- End ---->\n");
        }

        // check further nodes
        ts.forEachChild(node, checkVariabilityForNode);
    }

    /**
     * Searches for variability identifiers in jsdoc comments.
     * This is a helper function.
     * @param node
     */
    function searchInJSDoc(node: ts.Node) {
        if(!isUndefined(node.parent) && !isUndefined(node.parent.jsDoc)) {
            for(let i = 0; i< node.parent.jsDoc.length; i++) {
                let doc = node.parent.jsDoc[i];
                extractInfoFromTags(doc);
            }
        }
    }

    /**
     * This function searches comments text to find a variability
     * identifier among the comments text.
     *
     * @param comments
     * @param text
     */
    function extractInfoFromSingleLineComment(comments: any[], text: String) {

        // if there is a comment search for the '@variation' identifier among them!
        if (!isUndefined(comments)) {

            for(let cmt in comments) {
                let commentText = text.slice(comments[cmt].pos, comments[cmt].end).replace(/\s/g, "").slice(2);

                let parsedComments = doctrine.parse(commentText, {unwrap:true, tags:["variability"]});
                console.log(parsedComments);

                // log the comments!
                console.log(
                    "comment #" +
                    cmt + ":\n\t comment-pos = " + comments[cmt].pos +
                    ";\n\t comment-end = " + comments[cmt].end +
                    ";\n\t text = " + commentText);

            }
        }

    }

    /**
     * This function extracts information from tags flags
     * in the JSDoc comments.
     * @param doc
     */
    function extractInfoFromTags(doc: any) {

        if (isUndefined(doc.tags)) {
            return ;
        }

        console.log("JS Doc: {pos:" + doc.pos + " end: " + doc.end + "} tags: " + doc.tags.toString());

        for(let i = 0; i < doc.tags.length; i++) {
            console.log("\t" + i + ")");
            console.log("\tTag name:" + doc.tags[i].tagName.escapedText);
            console.log("\tComment:" + doc.tags[i].comment);
        }

        console.log();
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