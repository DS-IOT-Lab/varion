import {ClassDeclaration, JSDoc, Node, SourceFile, ts} from "ts-simple-ast";
import {DocCommentAnalyzer} from "../../../../main/typeScriptAnalyzers/DocCommentAnalyzer";
import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";


export class ClassVariationPoint implements AbstractVariationPointContainer {

    private sourceFile: SourceFile;
    private classDec: ClassDeclaration;
    private variabilityExp: String = null;
    private isIncludedInSource: Boolean = true;
    private readonly jsDocs: JSDoc[];
    private readonly className: String;

    private internalVariationPoints: Array<AbstractVariationPointContainer>;

    constructor(sourceFile: SourceFile, node: Node<ts.ClassDeclaration>) {
        this.sourceFile = sourceFile;
        this.classDec = node as ClassDeclaration;
        this.jsDocs = this.classDec.getJsDocs();
        this.className = this.classDec.getName();

        this.internalVariationPoints = [];

        this.extractVariationExpression();
    }

    getVariationExpression(): String {
        if (this.variabilityExp != null) {
            return this.variabilityExp;
        }

        return null;
    }

    public printInfo(): String {
        return "";
    }

    public variationExpressionContains(conditionExpression: String): boolean {
        return this.variabilityExp.indexOf(conditionExpression.toString()) >= 0;
    }

    public getJsDocs(): JSDoc[] {
        return this.jsDocs;
    }

    public applyVariation(): boolean {
        return false;
    }

    public getClassName(): String {
        return this.className;
    }

    public getInternalVariationPoints(): Array<AbstractVariationPointContainer> {
        return this.internalVariationPoints;
    }

    setVariationPointState(status: Boolean) {
        this.isIncludedInSource = true;
    }

    getVariationPointState(): Boolean {
        return this.isIncludedInSource;
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

    private removeClassFromSource(): boolean {
        return false;
    }

    addToInternalVariationPoint(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }


}