import {VariationPointContainerType} from "../VariationPointContainerType";

export interface AbstractVariationPointContainer {
    getInternalVariationPoints(): Array<AbstractVariationPointContainer>;

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    printInfo(): String;

    applyVariation();

    setVariationPointState(status: Boolean);

    getVariationPointState(): Boolean;

    addToInternalVariationPoint(variationPoint: AbstractVariationPointContainer);

    getVariationPointType(): VariationPointContainerType;

}