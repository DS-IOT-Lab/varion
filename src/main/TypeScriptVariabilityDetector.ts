import {ClassDeclaration, InterfaceDeclaration, SourceFile, SyntaxKind} from "ts-simple-ast";
import {ClassAnalyzer} from './typeScriptAnalyzers/ClassAnalyzer';
import {InterfaceAnalyzer} from './typeScriptAnalyzers/InterfaceAnalyzer';
import {ClassVariationPoint} from "../helper/variationContainer/typescript/implementation/ClassVariationPoint";
import {AbstractVariationPointContainer} from "../helper/variationContainer/AbstractVariationPointContainer";

export class TypeScriptVariabilityDetector {

    public static analyzeSourceFile(sourceFile: SourceFile): Array<AbstractVariationPointContainer> {
        let tsVariationPoints: Array<AbstractVariationPointContainer> = [];

        let temp = TypeScriptVariabilityDetector.analyzeClassDeclaration(sourceFile);
        tsVariationPoints = tsVariationPoints.concat(temp);

        // TODO: analyzeJsDoc imports
        // TODO: analyzeJsDoc modules
        // TODO: analyzeJsDoc enums
        TypeScriptVariabilityDetector.analyzeInterfaceDeclaration(sourceFile);

        return tsVariationPoints;
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

    private static analyzeClassDeclaration(sourceFile: SourceFile): Array<AbstractVariationPointContainer> {
        let classes: ClassDeclaration[] = sourceFile.getChildren()[0].getChildrenOfKind(SyntaxKind.ClassDeclaration);
        let clsAnalyzer: ClassAnalyzer = ClassAnalyzer.getInstance();
        let classVariationPoints: Array<ClassVariationPoint> = [];

        // iterating classes declared inside each source file
        for (let i = 0; i < classes.length; i++) {
            let classDec: ClassDeclaration = classes[i];
            let cvp: ClassVariationPoint = new ClassVariationPoint(sourceFile, classDec);
            classVariationPoints.push(cvp);
            clsAnalyzer.analyze(sourceFile, classDec, cvp);
        }

        return classVariationPoints;
    }
}
