import {Analyzer} from './Analyzer'
import {ConditionEvaluator} from '../ConditionEvaluator';
import {HtmlVariationPoint} from "../../helper/variationContainer/html/implementation/HtmlVariationPoint";
import {VariationPointContainerType} from "../../helper/VariationPointContainerType";

export class HTMLConditionalTagAnalyzer extends Analyzer {
    private $: any;

    constructor() {
        super();
    }

    public analyze(sourceText: string, file: any, $: any = null): Array<HtmlVariationPoint> {
        this.$ = $;
        return this.searchForTagsWithConditionAttribute(sourceText, file, $);
    }

    /**
     * This method finds tags containing 'condition' attribute in the given
     * html source file and checks the conditon expression defined for each
     * 'condition' attribute and removes the tags properly if required.
     *
     * @param  {string} sourceText given source file text
     * @param           file       file
     * @param $
     * @return {string}            derived html text
     */
    private searchForTagsWithConditionAttribute(sourceText: string, file, $): Array<HtmlVariationPoint> {
        // get the tags containing 'condition' attribute
        let tags = this.$('[condition]');
        let variationPointsList: Array<HtmlVariationPoint> = [];

        // iterate through each tag which has 'condition' attribute
        for (let i = 0; i < tags.length; i++) {
            let curTag = tags[i];

            // if current tag is a <presence> tag continue cause it will be analyzed by the presence tag analyzer
            if (tags[i].name === "presence") {
                continue;
            }

            let conditionExp = this.$(curTag).attr('condition');

            if (conditionExp != undefined) {
                let variationPoint = new HtmlVariationPoint(curTag, conditionExp, VariationPointContainerType.HTML_CONDITIONAL_TAG, this.$);
                let res = ConditionEvaluator.evaluate(conditionExp);

                variationPoint.setVariationPointState(res);
                variationPointsList.push(variationPoint);
            }
        }

        return variationPointsList;
    }
}
