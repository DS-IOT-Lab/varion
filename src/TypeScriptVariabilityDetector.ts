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
import {ClassAnalyzer} from './typeScriptAnalyzers/ClassAnalyzer';

export class TypeScriptVariabilityDetector {

    public static analyzeSourceFile(sourceFile: SourceFile) {
        TypeScriptVariabilityDetector.analyzeClassDeclaration(sourceFile);
        // TODO: analyzeJsDoc imports
        // TODO: analyzeJsDoc modules
        // TODO: analyzeJsDoc enums
        // TODO: analyzeJsDoc interfaces
    }

    private static analyzeImportDeclaration(sourceFile: SourceFile) {
        // TODO: implement
    }

    private static analyzeModuleDeclaration(sourceFile: SourceFile) {
        // TODO: implement
    }

    private static analyzeEnumDeclaration(sourceFile: SourceFile) {
        // TODO: implement
    }

    private static analyzeInterfaceDeclaration(sourceFile: SourceFile) {
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
