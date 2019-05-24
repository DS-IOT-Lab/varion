import {Analyzer} from './Analyzer'
import {ConditionEvaluator} from '../ConditionEvaluator';
import {HtmlVariationPoint} from "../../helper/variationContainer/html/implementation/HtmlVariationPoint";
import {VariationPointContainerType} from "../../helper/VariationPointContainerType";

export class HTMLPresenceTagAnalyzer extends Analyzer {
    private $: any;

    constructor() {
        super();
    }

    analyze(sourceText: string, file, $ = null): Array<HtmlVariationPoint> {
        this.$ = $;
        return this.searchForPresenceTags(sourceText, file, $);
    }


    private searchForPresenceTags(sourceText: string, file, $): Array<HtmlVariationPoint> {
        let variationPointsList: Array<HtmlVariationPoint> = [];

        // get the html '<presence> ... </presence>' tags
        let presenceTags = this.$('presence');

        for (let i = 0; i < presenceTags.length; i++) {

            // get the condition attribute of presence tags
            let conditionExp = this.$(presenceTags[i]).attr('condition');

            if (conditionExp != undefined) {
                let variationPoint = new HtmlVariationPoint(presenceTags[i], conditionExp, VariationPointContainerType.HTML_PRESENCE_TAG, this.$);
                let res = ConditionEvaluator.evaluate(conditionExp);

                variationPoint.setVariationPointState(res);
                variationPointsList.push(variationPoint);
            }
        }

        return variationPointsList;
    }
}
