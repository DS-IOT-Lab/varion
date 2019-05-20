import {VariationPointContainerType} from "../VariationPointContainerType";
import {VariationPointStatus} from "../VariationPointStatus";

export interface AbstractVariationPointContainer {
    getInternalVariationPoints(): Array<AbstractVariationPointContainer>;

    addToInternalVariationPoints(variationPoint: AbstractVariationPointContainer);

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    setVariationPointState(status: VariationPointStatus);

    getVariationPointState(): VariationPointStatus;

    getVariationPointType(): VariationPointContainerType;

    applyVariation();

    printInfo(): String;

}