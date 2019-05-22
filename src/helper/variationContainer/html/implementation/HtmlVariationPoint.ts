import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";
import {VariationPointStatus} from "../../../VariationPointStatus";
import {VariationPointContainerType} from "../../../VariationPointContainerType";


export class HtmlVariationPoint implements AbstractVariationPointContainer {
    private variationPointStatus: VariationPointStatus;
    private sourceFileText: String;
    private htmlElement: Object;
    private $;
    private readonly variabilityExpression: String;
    private readonly htmlVariationType: VariationPointContainerType;

    constructor(htmlElement, variabilityExpression: String, htmlVariationType: VariationPointContainerType, $) {
        this.variabilityExpression = "{" + variabilityExpression + "}";
        this.htmlElement = htmlElement;
        this.htmlVariationType = htmlVariationType;
        this.$ = $;
    }

    addToInternalVariationPoints(variationPoint: HtmlVariationPoint) {
        throw Error("Not Implemented Yet!"); //TODO: Implement
    }

    applyVariation() {
        // apply the variability on html file
        if (this.variationPointStatus == VariationPointStatus.NOT_INCLUDED) {
            this.$(this.htmlElement).empty();
            this.$(this.htmlElement).remove();
        } else {
            if (this.htmlVariationType == VariationPointContainerType.HTML_CONDITIONAL_TAG) {
                this.$(this.htmlElement).attr('condition', null);
            } else {
                let content = this.$(this.htmlElement).contents();
                this.$(this.htmlElement).replaceWith(content);
            }
        }
    }

    getInternalVariationPoints(): Array<HtmlVariationPoint> {
        return null; // TODO: Implement
    }

    getVariationExpression(): String {
        return this.variabilityExpression;
    }

    getVariationPointState(): VariationPointStatus {
        return this.variationPointStatus;
    }

    getVariationPointType(): VariationPointContainerType {
        return this.htmlVariationType;
    }

    printInfo(): String {
        throw Error("Not Implemented Yet!");
    }

    setVariationPointState(status: VariationPointStatus) {
        this.variationPointStatus = status;
    }

    variationExpressionContains(conditionExpression: String): boolean {
        return this.variabilityExpression.indexOf(conditionExpression.toString()) > 0;
    }

    setSourceFileText(sourceFileText: String) {
        this.sourceFileText = sourceFileText;
    }

    getSourceFileText(): String {
        return this.$.html();
    }
}