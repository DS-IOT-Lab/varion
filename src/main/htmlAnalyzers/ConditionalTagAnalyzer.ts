
import {Analyzer} from './Analyzer'
import {ConditionEvaluator} from '../ConditionEvaluator';
import * as cheerio from 'cheerio';
import chalk from 'chalk';

export class HTMLConditionalTagAnalyzer extends Analyzer {
    private $: any;

    constructor(){
        super();
    }
    
    public analyze(sourceText: string, file): string {
        return this.searchForTagsWithConditionAttribute(sourceText, file);
    }
    
    /**
     * This method finds tags containing 'condition' attribute in the given
     * html source file and checks the conditon expression defined for each 
     * 'condition' attribute and removes the tags properly if required.
     * 
     * @param  {string} sourceText given source file text
     * @param           file       file
     * @return {string}            derived html text
     */
    private searchForTagsWithConditionAttribute
    (sourceText: string, file): string {
        this.$ = cheerio.load(sourceText, {
            lowerCaseAttributeNames: false
        });

        // get the tags containing 'condition' attribute
        let tags = this.$('[condition]');
        
        // iterate thtough each tag which has 'condition' attribute
        for (let i = 0; i < tags.length; i++) {
            let curTag = tags[i];
            let conditionExp = this.$(curTag).attr('condition');
            
            if (conditionExp != undefined) {
                let res = ConditionEvaluator.evaluate(conditionExp);
                console.log(
                    chalk.green('\tCondition Expression: ') 
                    + conditionExp 
                    + chalk.blue(', Result -> ') 
                    + res);
                
                    this
                    .applyVariabilityOnConditionalTags
                    (curTag, res.valueOf());
                    
            } else {
                // no conditon attribute is defined 
                console.log(
                chalk.green('\tCondition Expression: ') 
                + 'No Condition Expression Found!');    
            }
        }
        
        return this.$.html();
    }
    
    
    /**
     * This method excludes or includes a conditionalTag properly based 
     * on the given configuration model evaluation result. 
     * 
     * @param               conditionalTag   given conditional html tag
     * @param  {boolean}    evaluationResult evaluated conditon expression result
     */
    private applyVariabilityOnConditionalTags
    (conditionalTag, evaluationResult: boolean) {
        
        if (!evaluationResult) {
            this.$(conditionalTag).empty();
            this.$(conditionalTag).remove();
        } else {
            this.$(conditionalTag).attr('condition', null);
        }
    }
}
