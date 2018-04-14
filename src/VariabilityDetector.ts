/**
 * Created by navid on 4/7/18.
 */
import {
    ImportDeclaration,
    SourceFile,
    SyntaxKind,
    Block,
    ClassDeclaration,
    ts,
    JSDoc,
    JSDocTag,
    Decorator
} from "ts-simple-ast";
import {ConditionEvaluator} from "./ConditionEvaluator";


export class VariabilityDetector {
    public static analyzeSourceFile(sourceFile: SourceFile) {
        // VariabilityDetector.analyzeImportDeclaration(sourceFile);
        VariabilityDetector.analyzeClassDeclaration(sourceFile);
    }

    private static analyzeImportDeclaration(sourceFile: SourceFile) {
        let x: Block[] = sourceFile.getChildren()[0].getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < x.length; i++) {
            let block: Block = x[i];
            let comments = ts.getLeadingCommentRanges(sourceFile.getText(), block.getPos());

            console.log("Heeey" + block.getPos());
            if (comments == undefined) {
                continue;
            }

            for (let j = 0; j < comments.length; j++) {
                console.log(sourceFile.getText().slice(comments[j].pos, comments[j].end));
            }

        }
    }

    private static analyzeClassDeclaration(sourceFile: SourceFile) {
        let classes: ClassDeclaration[] = sourceFile.getChildren()[0].getChildrenOfKind(SyntaxKind.ClassDeclaration);

        for (let i = 0; i < classes.length; i++) {
            let classDec: ClassDeclaration = classes[i];
            let jsDocs = classDec.getJsDocs();

            console.log('Analyzing ' + classDec.getName() + ' ...');
            for (let j = 0; j < jsDocs.length; j++) {
                let condition = this.processJsDoc(jsDocs[j]);

                if (!condition) {
                    this.removeClass(sourceFile, classDec);
                    break;  // TODO: ask if this is ok?!
                }
            }

        }
    }

    private static removeClass(sourceFile: SourceFile, classDec: ClassDeclaration) {
        console.log('Removing class initiation sequence: (#Class, '
            + classDec.getName()
            + ', '
            + classDec.getPos()
            + ', '
            + classDec.getEnd()
            + ')');


        // get class decorators
        let classDecorators: Decorator[] = classDec.getDecorators();

        // removing decorators
        console.log('1) Removing ' + classDec.getName() + ' decorators:');
        for (let i = 0; i < classDecorators.length; i++) {
            console.log('1- ' + i + ') Removing decorator: (#Decorator, '
                + classDecorators[i].getName()
                + ', '
                + classDecorators[i].getPos()
                + ', '
                + classDecorators[i].getEnd()
                + ')');

            classDecorators[i].remove();
        }

        //removing JSDocs
        console.log('2- Removing ' + classDec.getName() + ' JS Docs:');
        let jsDocs = classDec.getJsDocs();
        for (let i = 0; i<jsDocs.length ; i++) {
            console.log('2-' + i + ') Removing JSDoc: (#JSDoc, '
                + jsDocs[i].getPos()
                + ', '
                + jsDocs[i].getEnd()
                + ')' );

            jsDocs[i].remove();
        }

        // removing class itself
        console.log('3- Removing class: ' + classDec.getName());
        sourceFile.removeText(classDec.getPos(), classDec.getEnd());
    }

    private static processJsDoc(jsDoc: JSDoc): boolean {
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
}