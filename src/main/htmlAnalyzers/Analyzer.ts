import {HtmlVariationPoint} from "../../helper/variationContainer/html/implementation/HtmlVariationPoint";

export abstract class Analyzer {
    protected abstract analyze(sourceText: string, file: any, $: any): Array<HtmlVariationPoint>;
}