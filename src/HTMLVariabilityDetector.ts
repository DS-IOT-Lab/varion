import * as $ from 'cheerio';
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


export class HTMLVariabilityDetector {
    public analyzeSourceFile(sourceFile: SourceFile) {
        
    }
}