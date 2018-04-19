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
    Decorator,
    MethodDeclaration,
    Node
} from "ts-simple-ast";
import {ConditionEvaluator} from "./ConditionEvaluator";
import {ClassAnalyzer} from './analyzers/ClassAnalyzer';


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
        let clsAnalyzer: ClassAnalyzer = ClassAnalyzer.getInstance();
        
        // iterating classes declared inside each source file
        for (let i = 0; i < classes.length; i++) {
            let classDec: ClassDeclaration = classes[i];
            clsAnalyzer.analyze(sourceFile, classDec);
        }
    }
}
