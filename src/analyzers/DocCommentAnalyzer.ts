import {
    ImportDeclaration,
    SourceFile,
    SyntaxKind,
    Block,
    ClassDeclaration,
    ts,
    JSDoc,
    JSDocTag,
    Decorator,
    MethodDeclaration,
    Node
} from "ts-simple-ast";

import {ConditionEvaluator} from '../ConditionEvaluator';
import {Analyzer} from './Analyzer';
import * as doctrine from 'doctrine';

/**
 * [analyzeJsDoc description]
 * @param  jsDoc [description]
 * @return       [description]
 */
export class DocCommentAnalyzer {

    /**
     * This function analyzes and evaluates a given JS Document and searches
     * for the '@presence' tag
     * @param  jsDoc {JsDoc} given JS document to analyze and evaluate
     * @return       {boolean} returns the evaluation result
     */
    public static analyzeJsDoc(jsDoc: JSDoc): boolean {
        let tags = jsDoc.getTags();

        // searching for '@presence' tag
        for (let i = 0; i < tags.length; i++) {
            let currentTag: JSDocTag = tags[i];
            let tagName = currentTag.getTagNameNode().getText();

            // if tag name is 'presence' then check the comment part
            if (tagName == 'presence') {
                let tagComment = currentTag.getComment();
                let variationResult = ConditionEvaluator.evaluate(tagComment);
                console.log('\t\tpresence result = ' + variationResult);

                if (!variationResult) {
                    return false;   // TODO: ask if its ok?!
                }
            }
        }

        return true;
    }


    /**
     * This function analyzes and evaluates a given single comment and searches
     * for the '@presence' tag
     * @param  commentText {string} single comment text
     * @return             {boolean} return the evaluation result
     */
    public static analyzeSingleLineComment(commentText: string): boolean {
        commentText = commentText.replace(/\//g, '').trim();
        console.log('\t\t\t\tsingle line comment Text -> "' + commentText + '"');

        // turn the single comment to jsdoc comment and parse using doctrine lib
        let parsedDoc = doctrine.parse(['/**', ' * ' + commentText, '*/'].join('\n'), {unwrap: true});

        // search for '@presence' tag
        for (let i = 0; i < parsedDoc.tags.length; i++) {
            if (parsedDoc.tags[i].title === 'presence') {
                let variationResult = ConditionEvaluator.evaluate(parsedDoc.tags[i].description);

                console.log('\t\t\t\t\tPresence result = ' + variationResult);

                if (!variationResult) {
                    return false;   // TODO: ask if its ok?!
                }
            }
        }

        return true;
    }
}
