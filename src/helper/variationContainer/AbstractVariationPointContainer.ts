import {VariationPointContainerType} from "../VariationPointContainerType";

export interface AbstractVariationPointContainer {
    getInternalVariationPoints(): Array<AbstractVariationPointContainer>;

    addToInternalVariationPoints(variationPoint: AbstractVariationPointContainer);

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    setVariationPointState(status: Boolean);

    getVariationPointState(): Boolean;

    getVariationPointType(): VariationPointContainerType;

    applyVariation();

    printInfo(): String;

}