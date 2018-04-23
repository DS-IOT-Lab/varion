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
import { ConditionEvaluator } from "../ConditionEvaluator";
import { Analyzer } from './Analyzer';
import { DocCommentAnalyzer } from './DocCommentAnalyzer';
import { BlockAnalyzer } from './BlockAnalyzer';

// singleton 
export class MethodAnalyzer extends Analyzer {
    private static instance: MethodAnalyzer;


    private constructor() {
        super();
    }

    public static getInstance() {
        if (MethodAnalyzer.instance == null) {
            MethodAnalyzer.instance = new MethodAnalyzer();
        }

        return MethodAnalyzer.instance;
    }

    public analyze(sourceFile: SourceFile,
        node: Node<ts.MethodDeclaration>): boolean {
        let methodDeclaration: MethodDeclaration = node as MethodDeclaration;
        console.log('\tAnalyzing Method ' + methodDeclaration.getName() + ' ...');

        let jsDocs: JSDoc[] = methodDeclaration.getJsDocs();
        let isIncluded: boolean = true;

        // inspecting each method's JS-Doc
        for (let i = 0; i < jsDocs.length; i++) {
            isIncluded = DocCommentAnalyzer.analyzeJsDoc(jsDocs[i]);
            if (!isIncluded) {
                this.removeMethod(sourceFile, methodDeclaration);
                sourceFile.emit();
                return false;
            }
        }

        if (isIncluded) {
            this.checkMethodBody(methodDeclaration);
            return true;
        }
    }

    private removeMethod(sourceFile: SourceFile,
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

    private checkMethodBody(methodDeclaration: MethodDeclaration) {
        if(methodDeclaration.hasBody()) {
            let block = methodDeclaration.getChildrenOfKind(SyntaxKind.Block)[0];
            let blkAnalyzer = new BlockAnalyzer();

            blkAnalyzer.analyze(methodDeclaration.getSourceFile(), block as Block);
        }
    }



}
