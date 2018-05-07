/**
 * Created by navid on 4/7/18.
 */
import {
    ImportDeclaration,
    SourceFile,
    SyntaxKind,
    Block,
    ClassDeclaration,
    InterfaceDeclaration,
    ts,
    JSDoc,
    JSDocTag,
    Decorator,
    MethodDeclaration,
    Node
} from "ts-simple-ast";
import {ConditionEvaluator} from "./ConditionEvaluator";
import {ClassAnalyzer} from './typeScriptAnalyzers/ClassAnalyzer';
import {InterfaceAnalyzer} from './typeScriptAnalyzers/InterfaceAnalyzer';

export class TypeScriptVariabilityDetector {

    public static analyzeSourceFile(sourceFile: SourceFile) {
        TypeScriptVariabilityDetector.analyzeClassDeclaration(sourceFile);
        // TODO: analyzeJsDoc imports
        // TODO: analyzeJsDoc modules
        // TODO: analyzeJsDoc enums
        TypeScriptVariabilityDetector.analyzeInterfaceDeclaration(sourceFile);
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
        let interfaces: InterfaceDeclaration[] = sourceFile
                                                .getChildren()[0]
                                                .getChildrenOfKind(SyntaxKind.InterfaceDeclaration);
        let intAnalyzer: InterfaceAnalyzer = InterfaceAnalyzer.getInstance();
        
        // iterating interfaces 
        for (let i = 0; i < interfaces.length; i++) {
            let interfaceDec: InterfaceDeclaration = interfaces[i];
            intAnalyzer.analyze(sourceFile, interfaceDec);
        }
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
