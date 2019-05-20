import {ClassDeclaration, Decorator, JSDoc, Node, SourceFile, ts} from "ts-simple-ast";
import {DocCommentAnalyzer} from "../../../../main/typeScriptAnalyzers/DocCommentAnalyzer";
import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";
import {VariationPointContainerType} from "../../../VariationPointContainerType";
import {VariationPointStatus} from "../../../VariationPointStatus";


export class ClassVariationPoint implements AbstractVariationPointContainer {

    private sourceFile: SourceFile;
    private classDec: ClassDeclaration;
    private variabilityExp: String = null;
    private variationPointStatus: VariationPointStatus;
    private readonly jsDocs: JSDoc[];
    private readonly className: String;

    private internalVariationPoints: Array<AbstractVariationPointContainer>;

    constructor(sourceFile: SourceFile, node: Node<ts.ClassDeclaration>) {
        this.sourceFile = sourceFile;
        this.classDec = node as ClassDeclaration;
        this.jsDocs = this.classDec.getJsDocs();
        this.className = this.classDec.getName();
        this.variationPointStatus = VariationPointStatus.UNDEFINED;
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

    public applyVariation() {
        if (this.variationPointStatus == VariationPointStatus.NOT_INCLUDED) {
            this.removeClassFromSource();
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

    public getClassName(): String {
        return this.className;
    }

    public getInternalVariationPoints(): Array<AbstractVariationPointContainer> {
        return this.internalVariationPoints;
    }

    setVariationPointState(status: VariationPointStatus) {
        this.variationPointStatus = status;
    }

    getVariationPointState(): VariationPointStatus {
        return this.variationPointStatus;
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

    private removeClassFromSource() {

        // get class decorators
        let classDecorators: Decorator[] = this.classDec.getDecorators();

        // removing decorators
        for (let i = 0; i < classDecorators.length; i++) {
            classDecorators[i].remove();
        }

        //removing JSDocs
        let jsDocs = this.classDec.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {
            jsDocs[i].remove();
        }

        // removing class itself
        this.classDec.remove();

        // emit changes
        this.sourceFile.emit();
    }

    addToInternalVariationPoints(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }

    getVariationPointType(): VariationPointContainerType {
        return VariationPointContainerType.TS_CLASS;
    }


}