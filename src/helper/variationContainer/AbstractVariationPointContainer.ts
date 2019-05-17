export interface AbstractVariationPointContainer {
    getInternalVariationPoints(): Array<AbstractVariationPointContainer>;

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    printInfo(): String;

    applyVariation(): boolean;

    setVariationPointState(status: Boolean);

    getVariationPointState(): Boolean;

}