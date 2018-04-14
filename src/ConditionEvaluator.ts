
import * as filter from "../lib/filter.js";

export class ConditionEvaluator {
    private static rawConfiguration;
    private static transformedConfiguration;

    public static init(configuration){
        ConditionEvaluator.rawConfiguration = configuration;
        ConditionEvaluator.transformedConfiguration = JSON.parse(configuration, ConditionEvaluator.transformerFunction);
    }

    private static transformerFunction(name, value) {
        if(name == '') return value;

        if(value) {
            return 1;
        } else if (!value) {
            return 0;
        }

        return undefined;
    }

    public static evaluate(conditionExpression: String): Boolean {
        let compiledExpression = filter.compileExpression(conditionExpression);
        return compiledExpression(this.transformedConfiguration);
    }
}

//ConditionEvaluator.init('{"f1": true, "g2": false, "f3": true, "f4": false}');
//console.log(ConditionEvaluator.evaluate(""));