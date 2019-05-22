import {AbstractVariationPointContainer} from "./variationContainer/AbstractVariationPointContainer";

// TODO: add JS-Docs !!!
export interface SourcePathToVariationPointsMap {
    [sourcePath: string]: Array<AbstractVariationPointContainer>;
}
