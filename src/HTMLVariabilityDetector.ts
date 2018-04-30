import * as cheerio from 'cheerio';
import {
    ImportDeclaration,
    SourceFile,
    SyntaxKind,
    Block,
    ClassDeclaration,
    ts,
    JSDoc,
    JSDocTag,
    Decorator,
    MethodDeclaration,
    Node
} from "ts-simple-ast";
import {ConditionEvaluator} from './ConditionEvaluator';
import {HTMLAnalyzer} from './htmlAnalyzer/HTMLAnalyzer';
import * as fs from "fs";
import chalk from "chalk";
import {isUndefined} from "util";


export class HTMLVariabilityDetector {
    public static analyzeSourceFile(sourceText: string, file) {
        let $ = cheerio.load(sourceText);
        let presenceTags = $('presence');

        console.log(chalk.cyan(file));
        for (let i = 0; i < presenceTags.length; i++) {
            let conditionExp = $(presenceTags[i]).attr('condition');

            if (conditionExp != undefined) {
                let res = ConditionEvaluator.evaluate(conditionExp);
                console.log(chalk.green('\tCondition Expression: ') + conditionExp + chalk.blue(', Result -> ') + res);

                if (!res) {
                    $(presenceTags[i]).empty();
                    $(presenceTags[i]).remove();
                } else {
                    let content = $(presenceTags[i]).contents();
                    $(presenceTags[i]).replaceWith(content);
                }

            } else {
                console.log(chalk.green('\tCondition Expression: ') + 'No Condition Expression Found!');
            }
        }

        if (presenceTags.length == 0) {
            console.log('\tNo variation point found for this document.')
        }
        return $.html()
    }
}