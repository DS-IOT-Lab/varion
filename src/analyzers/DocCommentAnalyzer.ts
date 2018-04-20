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

export class DocCommentAnalyzer {

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
                console.log('presence result = ' + variationResult);

                if (!variationResult) {
                    return false;   // TODO: ask if its ok?!
                }
            }
        }

        return true;
    }

    public static analyzeSingleLineComment(commentText: string): boolean {
        commentText = commentText.replace(/\//g, '').trim();
        console.log('single line comment Text -> "' + commentText + '"');

        let parsedDoc = doctrine.parse(['/**', ' * ' + commentText, '*/'].join('\n'), {unwrap: true});
        for (let i = 0; i < parsedDoc.tags.length; i++) {

            if(parsedDoc.tags[i].title === 'presence') {
                let variationResult = ConditionEvaluator.evaluate(parsedDoc.tags[i].description);

                console.log('presence result = ' + variationResult);

                if (!variationResult) {
                    return false;   // TODO: ask if its ok?!
                }
            }
        }

        return true;
    }
} 