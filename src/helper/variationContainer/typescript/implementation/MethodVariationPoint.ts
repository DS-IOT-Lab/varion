import {Decorator, JSDoc, MethodDeclaration, Node, ParameterDeclaration, SourceFile, ts} from "ts-simple-ast";
import {DocCommentAnalyzer} from "../../../../main/typeScriptAnalyzers/DocCommentAnalyzer";
import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";
import {VariationPointContainerType} from "../../../VariationPointContainerType";


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

    applyVariation() {
        if (!this.isIncludedInSource) {
            this.removeMethodFromSource();
            return;
        } else {
            if (this.internalVariationPoints.length > 0) {
                for (let internalVariationPointIndex in this.internalVariationPoints) {
                    let internalVariationPoint = this.internalVariationPoints[internalVariationPointIndex];
                    internalVariationPoint.applyVariation();
                }
            }
        }
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

    removeMethodFromSource() {

        // getting and removing method decorators
        let methodDecorators: Decorator[] = this.methodDec.getDecorators();
        for (let i = 0; i < methodDecorators.length; i++) {
            methodDecorators[i].remove();
        }

        // getting and removing method JSDocs
        let jsDocs: JSDoc[] = this.methodDec.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {

            jsDocs[i].remove();
        }

        // removing method itself
        this.methodDec.remove();

        // emit changes to the source file
        this.sourceFile.emit();
    }

    public addToInternalVariationPoints(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }

    getVariationPointType(): VariationPointContainerType {
        return VariationPointContainerType.TS_METHOD;
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

}