
import {Analyzer} from './Analyzer'
import {ConditionEvaluator} from '../ConditionEvaluator';
import * as cheerio from 'cheerio';
import chalk from 'chalk';

export class HTMLPrseenceTagAnalyzer extends Analyzer {
    private $: any;

    constructor(){
        super();
    }
    
    public analyze(sourceText: string, file): string {
        this.$ = cheerio.load(sourceText);
        return this.searchForPresenceTags(sourceText, file);
    }
    

    private searchForPresenceTags
    (sourceText: string, file) {
        this.$ = cheerio.load(sourceText);
        
        // get the html '<presence> ... </presence>' tags
        let presenceTags = this.$('presence');   

        console.log(chalk.cyan(file));
        for (let i = 0; i < presenceTags.length; i++) {
            
            // get the condition attribute of presence tags
            let conditionExp = this.$(presenceTags[i]).attr('condition');    
            
            if (conditionExp != undefined) {
                
                let res = ConditionEvaluator.evaluate(conditionExp);
                console.log(
                    chalk.green('\tCondition Expression: ') 
                    + conditionExp 
                    + chalk.blue(', Result -> ') 
                    + res);
                
                    this.
                    applyVariabilityOnPresenceTag
                    (presenceTags[i], res.valueOf());
                    
            } else {
                // no conditon attribute is defined 
                console.log(
                chalk.green('\tCondition Expression: ') 
                + 'No Condition Expression Found!');
                
            }
        }

        // no variation point is declared in the sourceFile text
        if (presenceTags.length == 0) {
            console.log('\tNo variation point found for this document.')
        }
        
        return this.$.html();
    }
    
    
    private applyVariabilityOnPresenceTag
    (presenceTag, evaluationResult: boolean) {
        
        // apply the variability on html file
        if (!evaluationResult) {
            this.$(presenceTag).empty();
            this.$(presenceTag).remove();
        } else {
            let content = this.$(presenceTag).contents();
            this.$(presenceTag).replaceWith(content);
        }
    }
}
