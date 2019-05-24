import {HTMLPresenceTagAnalyzer} from './htmlAnalyzers/PresenceTagAnalyzer';
import {HTMLConditionalTagAnalyzer} from './htmlAnalyzers/ConditionalTagAnalyzer';
import {HtmlVariationPoint} from "../helper/variationContainer/html/implementation/HtmlVariationPoint";
import * as cheerio from "cheerio";

export class HTMLVariabilityDetector {

    public static analyzeSourceFile(sourceText: string, file): Array<HtmlVariationPoint> {
        let presenceAnalyzer = new HTMLPresenceTagAnalyzer();
        let condTagAnalyzer = new HTMLConditionalTagAnalyzer();

        let $ = cheerio.load(sourceText, {
            lowerCaseAttributeNames: false
        });

        let temp = presenceAnalyzer.analyze(sourceText, file, $);
        let temp2 = condTagAnalyzer.analyze(sourceText, file, $);

        return temp.concat(temp2);
    }
}