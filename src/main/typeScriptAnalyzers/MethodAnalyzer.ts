import {Block, JSDoc, MethodDeclaration, Node, SourceFile, SyntaxKind, ts} from "ts-simple-ast";

import {Analyzer} from './Analyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import {BlockAnalyzer} from './BlockAnalyzer';
import {AbstractVariationPointContainer} from "../../helper/variationContainer/AbstractVariationPointContainer";
import {BlockVariationPoint} from "../../helper/variationContainer/typescript/implementation/BlockVariationPoint";
import {VariationPointStatus} from "../../helper/VariationPointStatus";

/**
 * This Class checks the variability defined for each method.
 * NOTE: singleton
 */
export class MethodAnalyzer extends Analyzer {
    private static instance: MethodAnalyzer;


    private constructor() {
        super();
    }

    /**
     * this function returns an instance of the MethodAnalyzer
     * @return {MethodAnalyzer} MethodAnalyzerObject
     */
    public static getInstance() {
        if (MethodAnalyzer.instance == null) {
            MethodAnalyzer.instance = new MethodAnalyzer();
        }

        return MethodAnalyzer.instance;
    }

    /**
     * This method handles variation points set for a method inside a class.
     * @param  sourceFile [description]
     * @param  node       [description]
     * @param containerVariationPoint
     * @return            [description]
     */
    public analyze(sourceFile: SourceFile
        , node: Node<ts.MethodDeclaration>
        , containerVariationPoint: AbstractVariationPointContainer) {
        try {
            let methodDeclaration: MethodDeclaration = node as MethodDeclaration;

            let jsDocs: JSDoc[] = methodDeclaration.getJsDocs();
            let variationRes: VariationPointStatus = VariationPointStatus.UNDEFINED;

            // inspecting each method's JS-Doc
            for (let i = 0; i < jsDocs.length; i++) {
                variationRes = DocCommentAnalyzer.analyzeJsDoc(jsDocs[i]);
                containerVariationPoint.setVariationPointState(variationRes);
                // if (variationRes == VariationPointStatus.NOT_INCLUDED) {
                //     containerVariationPoint.setVariationPointState(VariationPointStatus.NOT_INCLUDED);
                // }
            }
            this.checkMethodBody(methodDeclaration, containerVariationPoint);

        } catch (e) {
            console.log(e.toString());
        }
    }


    /**
     * This method searches for variation points defined inside a method
     * @param  methodDeclaration {MethodDeclaration} given mehtod declaration to search inside
     */
    private checkMethodBody(methodDeclaration: MethodDeclaration, containerVariationPoint: AbstractVariationPointContainer) {
        if (methodDeclaration.hasBody()) {
            let block = methodDeclaration.getChildrenOfKind(SyntaxKind.Block)[0];
            let blkAnalyzer = new BlockAnalyzer();
            let blockVariationPoint = new BlockVariationPoint(methodDeclaration.getSourceFile(), block);

            containerVariationPoint.addToInternalVariationPoints(blockVariationPoint);
            blkAnalyzer.analyze(methodDeclaration.getSourceFile(), block as Block, blockVariationPoint);
        }
    }
}
