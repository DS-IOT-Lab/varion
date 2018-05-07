import {
    ImportDeclaration,
    SourceFile,
    SyntaxKind,
    Block,
    InterfaceDeclaration,
    ts,
    JSDoc,
    JSDocTag,
    Decorator,
    MethodDeclaration,
    Node
} from "ts-simple-ast";

import { ConditionEvaluator } from '../ConditionEvaluator';
import { Analyzer } from './Analyzer';
import { MethodAnalyzer } from './MethodAnalyzer';
import { DocCommentAnalyzer } from './DocCommentAnalyzer';

export class InterfaceAnalyzer extends Analyzer {
    private static instance: InterfaceAnalyzer;

    private constructor() {
        super();
    }
    
    public static getInstance(): InterfaceAnalyzer {
        if (InterfaceAnalyzer.instance == null) {
            InterfaceAnalyzer.instance = new InterfaceAnalyzer();
        }
        
        return InterfaceAnalyzer.instance;
    }

    public analyze
        (sourceFile: SourceFile,
        node: Node<ts.InterfaceDeclaration>): boolean {

        let interfaceDec: InterfaceDeclaration;
        interfaceDec = node as InterfaceDeclaration;

        let jsDocs = interfaceDec.getJsDocs();
        let isIncluded = true;

        console.log('Analyzing Interface ' + interfaceDec.getName() + ' ...');

        for (let i = 0; i < jsDocs.length; i++) {

            isIncluded = DocCommentAnalyzer.analyzeJsDoc(jsDocs[i]);
            if (!isIncluded) {
                this.removeInterace(sourceFile, interfaceDec);
                return false;
            }
        }
        
        // TODO: checkout whether it is required to analyze the members of an interace or not.
        return true;
    }


    private removeInterace
        (sourceFile: SourceFile, interfaceDec: InterfaceDeclaration) {
        console.log('Removing interface initiation sequence: (#Inteface, '
            + interfaceDec.getName()
            + ', '
            + interfaceDec.getPos()
            + ', '
            + interfaceDec.getEnd()
            + ')');

        // removing JS-Docs
        console.log('1- Removing ' + interfaceDec.getName() + ' JS Docs:');
        let jsDocs = interfaceDec.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {
            console.log('2-' + i + ') Removing JSDoc: (#JSDoc,'
                + jsDocs[i].getPos()
                + ', '
                + jsDocs[i].getEnd()
                + ')');

            jsDocs[i].remove();
        }

        // removing interface itself
        console.log('2- Removing interface: ' + interfaceDec.getName());
        interfaceDec.remove();
    }
    
}







