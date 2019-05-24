import {ClassDeclaration, MethodDeclaration, Node, SourceFile, ts} from "ts-simple-ast";
import {Analyzer} from './Analyzer';
import {MethodAnalyzer} from './MethodAnalyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import {ClassVariationPoint} from "../../helper/variationContainer/typescript/implementation/ClassVariationPoint";
import {MethodVariationPoint} from "../../helper/variationContainer/typescript/implementation/MethodVariationPoint";
import {VariationPointStatus} from "../../helper/VariationPointStatus";


/**
 * This class handles the variation point defined inside a class.
 * NOTE: singleton
 */
export class ClassAnalyzer extends Analyzer {
    private static instance: ClassAnalyzer;
    private methodAnalyzerInstance: MethodAnalyzer;

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
     * @param containerVariationPoint
     * @return            {boolean} which indicates the class which was analyzed is included or not
     */
    public analyze(sourceFile: SourceFile, node: Node<ts.ClassDeclaration>, containerVariationPoint: ClassVariationPoint) {

        let classDec: ClassDeclaration;
        classDec = node as ClassDeclaration;

        let jsDocs = classDec.getJsDocs();
        let variationRes: VariationPointStatus = VariationPointStatus.UNDEFINED;

        // check whether it requires to remove each class itself or not by inspecting the each JSDoc for the class
        for (let j = 0; j < jsDocs.length; j++) {

            variationRes = DocCommentAnalyzer.analyzeJsDoc(jsDocs[j]);
            containerVariationPoint.setVariationPointState(variationRes);

            // if (variationRes == VariationPointStatus.NOT_INCLUDED) {  // not included
            //     containerVariationPoint.setVariationPointState(VariationPointStatus.NOT_INCLUDED);
            //     //this.removeClass(sourceFile, classDec);
            //     //return false;
            // }
        }

        this.analyzeClassMethods(sourceFile, classDec, containerVariationPoint);
    }

    /**
     * This method analyzes the methods defined inside a class, and checks the
     * variation points defined at method level.
     *
     * @param  sourceFile       {SourceFile} given source file
     * @param  classDeclaration {ClassDeclaration} class which contains this method
     * @param classVariationPoint
     */
    private analyzeClassMethods(sourceFile: SourceFile
        , classDeclaration: ClassDeclaration
        , classVariationPoint: ClassVariationPoint) {

        let instanceMethods: MethodDeclaration[] = classDeclaration.getInstanceMethods();
        let staticMethods: MethodDeclaration[] = classDeclaration.getStaticMethods();

        for (let i = 0; i < instanceMethods.length; i++) {
            // add the sub-variation points to the parent node
            let methodVariationPoint = new MethodVariationPoint(sourceFile, instanceMethods[i]);
            classVariationPoint.addToInternalVariationPoints(methodVariationPoint);

            // analyze the internal variation points defined inside the method
            this.methodAnalyzerInstance.analyze(sourceFile, instanceMethods[i], methodVariationPoint);
        }

        for (let i = 0; i < staticMethods.length; i++) {
            // add the sub-variation points to the parent node
            let methodVariationPoint = new MethodVariationPoint(sourceFile, instanceMethods[i]);
            methodVariationPoint = new MethodVariationPoint(sourceFile, staticMethods[i]);

            // analyze the internal variation points
            this.methodAnalyzerInstance.analyze(sourceFile, instanceMethods[i], methodVariationPoint);
        }
    }

}