import {Node, SourceFile} from "ts-simple-ast";
import {AbstractVariationPointContainer} from "../../helper/variationContainer/AbstractVariationPointContainer";

export abstract class Analyzer {
    /**
     * Abstract method which analyzes a given node and then return true or false.
     * {@code False} indicates that the given node is excluded from the final source.
     * {@code True} means that the given node is included in the final source.
     *
     * @param  sourceFile source file which holds the node
     * @param  node       given node to analyzeJsDoc
     * @param containerVariationPoint the variation point object which is passed to analyzed
     * @return            indicates whether the is excluded or not
     */
    protected abstract analyze(sourceFile: SourceFile, node: Node, containerVariationPoint: AbstractVariationPointContainer);
}
