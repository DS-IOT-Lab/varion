import {JSDoc, ts} from "ts-simple-ast";
import SourceFile = ts.SourceFile;


export interface TypeScriptVariation {

    getInternalVariationPoints(): Array<TypeScriptVariation>;

    getVariationExpression(): String;

    variationExpressionContains(conditionExpression: String): boolean;

    printInfo(): String;

    applyVariation(): boolean;
}

