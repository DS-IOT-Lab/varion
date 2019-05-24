import {JSDoc, JSDocTag} from "ts-simple-ast";
import {ConditionEvaluator} from '../ConditionEvaluator';
import * as doctrine from 'doctrine';
import {VariationPointStatus} from "../../helper/VariationPointStatus";

/**
 * [analyzeJsDoc description]
 * @param  jsDoc [description]
 * @return       [description]
 */
export class DocCommentAnalyzer {

    /**
     * This function analyzes and evaluates a given JS Document and searches
     * for the '@presence' tag
     * @param  jsDoc {JSDoc} given JS document to analyze and evaluate
     * @return       {boolean} returns the evaluation result
     */
    public static analyzeJsDoc(jsDoc: JSDoc): VariationPointStatus {

        let presenceConditionComment = this.extractVariabilityExpression(jsDoc);

        // no variation point means that code must remain in the final product
        if (presenceConditionComment == null) {
            return VariationPointStatus.INCLUDED
        } else {
            return ConditionEvaluator.evaluate(presenceConditionComment);
        }
    }

    /**
     * TODO: document!
     * @param {JSDoc} jsDoc
     * @returns {String}
     */
    public static extractVariabilityExpression(jsDoc: JSDoc): String {
        let tags = jsDoc.getTags();

        // searching for '@presence' tag
        for (let i = 0; i < tags.length; i++) {
            let currentTag: JSDocTag = tags[i];
            let tagName = currentTag.getTagNameNode().getText();

            // if tag name is 'presence' then check the comment part
            if (tagName == 'presence') {
                return currentTag.getComment();
            }
        }

        return null;
    }


    /**
     * This function analyzes and evaluates a given single comment and searches
     * for the '@presence' tag
     * @param  commentText {string} single comment text
     * @return             {boolean} return the evaluation result
     */
    public static analyzeSingleLineComment(commentText: string): VariationPointStatus {
        commentText = commentText.replace(/\//g, '').trim();

        // turn the single comment to jsdoc comment and parse using doctrine lib
        let parsedDoc = doctrine.parse(['/**', ' * ' + commentText, '*/'].join('\n'), {unwrap: true});

        // search for '@presence' tag
        for (let i = 0; i < parsedDoc.tags.length; i++) {
            if (parsedDoc.tags[i].title === 'presence') {
                return ConditionEvaluator.evaluate(parsedDoc.tags[i].description);
            }
        }

        return VariationPointStatus.UNDEFINED;
    }
}
