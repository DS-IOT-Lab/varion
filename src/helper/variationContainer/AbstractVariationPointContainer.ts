import {TypeScriptVariation} from "./typescript/TypeScriptVariation";

export interface AbstractVariationPointContainer {
    getInternalVariationPoints(): Array<TypeScriptVariation>;

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    printInfo(): String;

    applyVariation(): boolean;

    setVariationPointState(status: Boolean);

    getVariationPointState(): Boolean;

}