import chalk from 'chalk';
import {Parser} from 'expr-eval';


/**
 * This component's task is to accept a configuration model and evaluate given
 * expressions based on it.
 */
export class ConditionEvaluator {
    private static parser;
    private static configurationModel;

    /**
     * This function initializes the ConditionEvaluator provided the
     * configuration model.
     *
     * @param  configuration configuration model
     */
    public static init(configuration: any) {
        ConditionEvaluator.parser = new Parser;
        ConditionEvaluator.configurationModel = configuration;
    }

    /**
     * This function evaluates a given condition expression string against the
     * given configuration model.
     * NOTE: if the configuration variable is not defined it is evaluated as True.
     * @param  conditionExpression condition expression string
     * @return                     evaluation result
     */
    public static evaluate(conditionExpression): Boolean {
        
        conditionExpression = conditionExpression.replace(/{/g, '');
        conditionExpression = conditionExpression.replace(/}/g, '');

        let compiledExpression = ConditionEvaluator.parser.parse(conditionExpression);
        
        try {
            let res = compiledExpression.evaluate(ConditionEvaluator.configurationModel);
            return res;
        } catch (e) {
            console.log(chalk.red('Error: undefined configuration variable {' + conditionExpression + '}'));
        }
    }
}
