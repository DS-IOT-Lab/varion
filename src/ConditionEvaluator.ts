import * as filter from "../lib/filter.js";

export class ConditionEvaluator {
    private static rawConfiguration;
    private static transformedConfiguration;

    public static init(configuration: any) {
        ConditionEvaluator.rawConfiguration = configuration;
        ConditionEvaluator.transformedConfiguration = configuration;
    }

    private static transformerFunction(name, value) {
        if (name == '') return value;

        if (value) {
            return 1;
        } else if (!value) {
            return 0;
        }

        return undefined;
    }

    public static evaluate(conditionExpression: String): Boolean {
        // todo: remove '{' and '}' from the condition expression
        let compiledExpression = filter.compileExpression(conditionExpression);
        return compiledExpression(this.transformedConfiguration);
    }
}
