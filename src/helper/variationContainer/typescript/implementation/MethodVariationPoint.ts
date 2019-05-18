import {JSDoc, MethodDeclaration, Node, ParameterDeclaration, SourceFile, ts} from "ts-simple-ast";
import {DocCommentAnalyzer} from "../../../../main/typeScriptAnalyzers/DocCommentAnalyzer";
import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";


export class MethodVariationPoint implements AbstractVariationPointContainer {

    private sourceFile: SourceFile;
    private methodDec: MethodDeclaration;
    private variabilityExp: String = null;
    private isIncludedInSource: Boolean = true;
    private readonly jsDocs: Array<JSDoc>;
    private readonly methodName: String;
    private readonly parameters: Array<ParameterDeclaration>;

    private internalVariationPoints: Array<AbstractVariationPointContainer>;

    constructor(sourceFile: SourceFile, node: Node<ts.MethodDeclaration>) {
        this.sourceFile = sourceFile;
        this.methodDec = node as MethodDeclaration;
        this.jsDocs = this.methodDec.getJsDocs();
        this.methodName = this.methodDec.getName();
        this.parameters = this.methodDec.getParameters();

        this.internalVariationPoints = [];

        this.extractVariationExpression();
    }

    getVariationExpression(): String {
        if (this.variabilityExp != null) {
            return this.variabilityExp;
        }

        return null;
    }

    printInfo(): String {
        return "";
    }

    variationExpressionContains(conditionExpression: String): boolean {
        return this.variabilityExp.indexOf(conditionExpression.toString()) >= 0;
    }

    getJsDocs(): Array<JSDoc> {
        return this.jsDocs;
    }

    applyVariation(): boolean {
        return false;
    }

    getMethodName(): String {
        return this.methodName;
    }

    getInternalVariationPoints(): Array<AbstractVariationPointContainer> {
        return this.internalVariationPoints;
    }

    getVariationPointState(): Boolean {
        return this.isIncludedInSource;
    }

    setVariationPointState(status: Boolean) {
        this.isIncludedInSource = status;
    }

    private extractVariationExpression() {
        for (let j = 0; j < this.jsDocs.length; j++) {
            let variabilityExp = DocCommentAnalyzer.extractVariabilityExpression(this.jsDocs[j]);
            if (variabilityExp != null) {
                this.variabilityExp = variabilityExp;
                return variabilityExp;
            }
        }
    }

    private removeMethodFromSource(): Boolean {
        // TODO:
        return false;
    }

    addToInternalVariationPoint(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }

}