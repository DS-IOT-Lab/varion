import {AbstractVariationPointContainer} from "./variationContainer/AbstractVariationPointContainer";
import {HtmlVariationPoint} from "./variationContainer/html/implementation/HtmlVariationPoint";

// TODO: add JS-Docs !!!
export interface SourcePathToHtmlVariationPointsMap {
    [sourcePath: string]: Array<HtmlVariationPoint>;
}
