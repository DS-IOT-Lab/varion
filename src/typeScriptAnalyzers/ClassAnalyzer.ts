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
import {MethodAnalyzer} from './MethodAnalyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';


/**
 * This class handles the variation point defined inside a class.
 * NOTE: singleton
 */
export class ClassAnalyzer extends Analyzer {
    private methodAnalyzerInstance: MethodAnalyzer;
    private static instance: ClassAnalyzer;

    private constructor() {
        super();
        this.methodAnalyzerInstance = MethodAnalyzer.getInstance();
    }

    /**
     * This functions return an instance of the class analyzer.
     * @return {ClassAnalyzer} a ClassAnalyzer object
     */
    public static getInstance(): ClassAnalyzer {

        if (ClassAnalyzer.instance == null) {
            ClassAnalyzer.instance = new ClassAnalyzer();
        }

        return ClassAnalyzer.instance;
    }

    /**
     * This method takes a source file as input and a given ClassDeclaration node,
     * and analyzes it at different levels.
     *
     * @param  sourceFile {SourceFile} given source file to analyze
     * @param  node       {ClassDeclaration} given ClassDeclaration
     * @return            {boolean} which indicates the class which was analyzed is included or not
     */
    public analyze(sourceFile: SourceFile,
                   node: Node<ts.ClassDeclaration>): boolean {

        let classDec: ClassDeclaration;
        classDec = node as ClassDeclaration;

        let jsDocs = classDec.getJsDocs();
        let isIncluded = true;

        console.log('Analyzing Class ' + classDec.getName() + ' ...');

        // check whether it requires to remove each class itself or not by inspecting the each JSDoc for the class
        // TODO: ask about how to handle multiple JSDoc containing '@presence'
        for (let j = 0; j < jsDocs.length; j++) {

            isIncluded = DocCommentAnalyzer.analyzeJsDoc(jsDocs[j]);
            if (!isIncluded) {  // not included
                this.removeClass(sourceFile, classDec);
                return false;
            }
        }

        // if class is included check it's members
        if (isIncluded) {
            this.analyzeClassMethods(sourceFile, classDec);
            return true;
        }
    }

    /**
     * This method analyzes the methods defined inside a class, and checks the
     * variation points defined at method level.
     *
     * @param  sourceFile       {SourceFile} given source file
     * @param  classDeclaration {ClassDeclaration} class which contains this method
     */
    private analyzeClassMethods(sourceFile: SourceFile,
                                classDeclaration: ClassDeclaration) {

        let instanceMethods: MethodDeclaration[] = classDeclaration.getInstanceMethods();
        let staticMethods: MethodDeclaration[] = classDeclaration.getStaticMethods();

        for (let i = 0; i < instanceMethods.length; i++) {
            this.methodAnalyzerInstance.analyze(sourceFile, instanceMethods[i]);
        }

        for (let i = 0; i < staticMethods.length; i++) {
            this.methodAnalyzerInstance.analyze(sourceFile, instanceMethods[i]);
        }
    }

    private removeClass(sourceFile: SourceFile, classDeclaration: ClassDeclaration) {
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

}