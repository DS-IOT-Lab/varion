import {Parser} from 'expr-eval';
import {VariationPointStatus} from "../helper/VariationPointStatus";


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
    public static evaluate(conditionExpression): VariationPointStatus {

        conditionExpression = conditionExpression.replace(/{/g, '');
        conditionExpression = conditionExpression.replace(/}/g, '');

        let compiledExpression = ConditionEvaluator.parser.parse(conditionExpression);

        try {
            let res = compiledExpression.evaluate(ConditionEvaluator.configurationModel);
            if (res != undefined) {
                if (res) {
                    return VariationPointStatus.INCLUDED;
                } else {
                    return VariationPointStatus.NOT_INCLUDED;
                }
            }
        } catch (e) {
            return VariationPointStatus.UNDEFINED;
        }
    }

    public static checkConfigurationCovers(conditionExpression: String): VariationPointStatus {
        conditionExpression = conditionExpression.replace(/{/g, '');
        conditionExpression = conditionExpression.replace(/}/g, '');

        let compiledExpression = ConditionEvaluator.parser.parse(conditionExpression);

        try {
            let res = compiledExpression.evaluate(ConditionEvaluator.configurationModel);
            if (res != undefined) {
                if (res) {
                    return VariationPointStatus.INCLUDED;
                } else {
                    return VariationPointStatus.NOT_INCLUDED;
                }
            }
        } catch (e) {
            return VariationPointStatus.UNDEFINED;
        }
    }
}
