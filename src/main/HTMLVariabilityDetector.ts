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
import {HTMLPrseenceTagAnalyzer} from './htmlAnalyzers/PresenceTagAnalyzer';
import {HTMLConditionalTagAnalyzer} from './htmlAnalyzers/ConditionalTagAnalyzer';

import * as fs from "fs";
import chalk from "chalk";
import {isUndefined} from "util";


export class HTMLVariabilityDetector {
    
    public static analyzeSourceFile(sourceText: string, file): string {
        let presenceAnalyzer = new HTMLPrseenceTagAnalyzer();
        let condTagAnalyzer = new HTMLConditionalTagAnalyzer();
        
        let temp = presenceAnalyzer.analyze(sourceText, file);
        
        return condTagAnalyzer.analyze(temp, file); 
    }
}