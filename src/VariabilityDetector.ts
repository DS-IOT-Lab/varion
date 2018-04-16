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
    Decorator, MethodDeclaration
} from "ts-simple-ast";
import {ConditionEvaluator} from "./ConditionEvaluator";


export class VariabilityDetector {
    public static analyzeSourceFile(sourceFile: SourceFile) {
        VariabilityDetector.analyzeClassDeclaration(sourceFile);
        // TODO: analyze imports
        // TODO: analyze modules
        // TODO: analyze enums
        // TODO: analyze interfaces
    }

    private static analyzeImportDeclaration(sourceFile: SourceFile) {
        // TODO: implement
    }

    private static analyzeClassDeclaration(sourceFile: SourceFile) {
        let classes: ClassDeclaration[] = sourceFile.getChildren()[0].getChildrenOfKind(SyntaxKind.ClassDeclaration);

        // iterating classes declared inside each source file
        for (let i = 0; i < classes.length; i++) {
            let classDec: ClassDeclaration = classes[i];
            let jsDocs = classDec.getJsDocs();
            let isIncluded = true;

            console.log('Analyzing Class ' + classDec.getName() + ' ...');

            // check whether it requires to remove each class itself or not by inspecting the each JSDoc for the class
            // todo: ask about how to handle multiple JSDoc containing '@presence'
            for (let j = 0; j < jsDocs.length; j++) {

                isIncluded = this.processJsDoc(jsDocs[j]);
                if (!isIncluded) {  // not included
                    this.removeClass(sourceFile, classDec);
                    break;
                }
            }

            // if class is included check it's members
            if (isIncluded) {
                this.analyzeClassMethods(sourceFile, classDec);
            }
        }
    }

    private static removeClass(sourceFile: SourceFile, classDeclaration: ClassDeclaration) {
        console.log('Removing class initiation sequence: (#Class, '
            + classDeclaration.getName()
            + ', '
            + classDeclaration.getPos()
            + ', '
            + classDeclaration.getEnd()
            + ')');


        // get class decorators
        let classDecorators: Decorator[] = classDeclaration.getDecorators();

        // removing decorators
        console.log('1) Removing ' + classDeclaration.getName() + ' decorators:');
        for (let i = 0; i < classDecorators.length; i++) {
            console.log('1-' + i + ') Removing decorator: (#Decorator, '
                + classDecorators[i].getName()
                + ', '
                + classDecorators[i].getPos()
                + ', '
                + classDecorators[i].getEnd()
                + ')');

            classDecorators[i].remove();
        }

        //removing JSDocs
        console.log('2- Removing ' + classDeclaration.getName() + ' JS Docs:');
        let jsDocs = classDeclaration.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {
            console.log('2-' + i + ') Removing JSDoc: (#JSDoc, '
                + jsDocs[i].getPos()
                + ', '
                + jsDocs[i].getEnd()
                + ')');

            jsDocs[i].remove();
        }

        // removing class itself
        console.log('3) Removing class: ' + classDeclaration.getName());
        classDeclaration.remove();
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

    private static analyzeClassMethods(sourceFile: SourceFile, classDeclaration: ClassDeclaration) {
        let instanceMethods: MethodDeclaration[] = classDeclaration.getInstanceMethods();
        let staticMethods: MethodDeclaration[] = classDeclaration.getStaticMethods();

        for (let i = 0; i < instanceMethods.length; i++) {
            this.analyzeMethods(sourceFile, classDeclaration, instanceMethods[i]);
        }

        for (let i = 0; i < staticMethods.length; i++) {
            this.analyzeMethods(sourceFile, classDeclaration, instanceMethods[i]);
        }
    }

    private static analyzeMethods(sourceFile: SourceFile,
                                  classDeclaration: ClassDeclaration,
                                  methodDeclaration: MethodDeclaration) {

        let jsDocs: JSDoc[] = methodDeclaration.getJsDocs();
        let isIncluded: boolean = true;

        // inspecting each method's JS-Doc
        for (let i = 0; i < jsDocs.length; i++) {
            isIncluded = this.processJsDoc(jsDocs[i]);
            if (!isIncluded) {
                this.removeMethod(sourceFile, classDeclaration, methodDeclaration);
                sourceFile.emit();
                break;
            }
        }

        if (isIncluded) {
            this.checkMethodBody(sourceFile, classDeclaration, methodDeclaration)
        }
    }

    private static checkMethodBody(sourceFile: SourceFile,
                                   classDeclaration: ClassDeclaration,
                                   methodDeclaration: MethodDeclaration){
        // todo: implement

    }


    private static removeMethod(sourceFile: SourceFile,
                                classDeclaration: ClassDeclaration,
                                methodDeclaration: MethodDeclaration) {

        console.log('Removing method initiation sequence: (#Method, '
            + methodDeclaration.getName()
            + ', '
            + methodDeclaration.getPos()
            + ', '
            + methodDeclaration.getEnd()
            + ')');

        // getting and removing method decorators
        let methodDecorators: Decorator[] = methodDeclaration.getDecorators();
        console.log('1) Removing ' + methodDeclaration.getName() + ' decorators:');
        for (let i = 0; i < methodDecorators.length; i++) {
            console.log('1- ' + i + ') Removing decorator: (#Decorator, '
                + methodDecorators[i].getName()
                + ', '
                + methodDecorators[i].getPos()
                + ', '
                + methodDecorators[i].getEnd()
                + ')');

            methodDecorators[i].remove();
        }

        // getting and removing method JSDocs
        console.log('2) Removing ' + methodDeclaration.getName() + ' JS Docs:');
        let jsDocs: JSDoc[] = methodDeclaration.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {
            console.log('2-' + i + ') Removing JSDoc: (#JSDoc, '
                + jsDocs[i].getPos()
                + ', '
                + jsDocs[i].getEnd()
                + ')');

            jsDocs[i].remove();
        }

        // removing method itself
        console.log('3) Removing method: ' + methodDeclaration.getName());
        methodDeclaration.remove();
    }
}
