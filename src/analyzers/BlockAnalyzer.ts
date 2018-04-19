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
    Node, IfStatement,
} from 'ts-simple-ast';
import {CommentRange} from 'typescript';
import {ConditionEvaluator} from '../ConditionEvaluator';
import {Analyzer} from './Analyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import * as doctrine from 'doctrine';
import {isUndefined} from "util";

const BLOCK_CONTAINING_NODES: Array<SyntaxKind> =
    [SyntaxKind.IfStatement,
        SyntaxKind.WhileStatement,
        SyntaxKind.DoStatement,
        SyntaxKind.Block,
        SyntaxKind.ForStatement];

export class BlockAnalyzer {

    public analyze(sourceFile: SourceFile, node: Block) {
        this.analyzeBlock(sourceFile, node);
        return false;
    }

    public traverseBlockContent(sourceFile: SourceFile, node: Node) {
        if (BLOCK_CONTAINING_NODES.indexOf(node.getKind()) != -1) {

            switch (node.getKind()) {
                case SyntaxKind.Block:
                    this.analyzeBlock(sourceFile, node as Block);
                    break;

                case SyntaxKind.IfStatement:
                    this.analyzeIfStatements(sourceFile, node as IfStatement);
                    break;
                case SyntaxKind.DoStatement:
                    break;
                case SyntaxKind.WhileStatement:
                    break;
                case SyntaxKind.ForStatement:
                    break;
            }
        }

        return false; // FIXME: fix here!
    }

    private analyzeBlock(sourceFile: SourceFile, block: Block) {
        // first check the block it self!
        let isIncluded = this.analyzeLeadingComments(sourceFile, block);

        // if the block is not excluded then check its body
        if (isIncluded) {
            let blockContents: Node[] = block.getChildren()[1].getChildren();    // getting 'SyntaxList' children

            for (let i = 0; i < blockContents.length; i++) {
                this.traverseBlockContent(sourceFile, blockContents[i]);
            }
        }
    }

    private analyzeIfStatements(sourceFile: SourceFile, ifStatement: IfStatement) {
        let blockContents: Block[] = ifStatement.getChildrenOfKind(SyntaxKind.Block);
        let elifContents: IfStatement[] = ifStatement.getChildrenOfKind(SyntaxKind.IfStatement);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i]);
        }

        for (let i = 0; i < elifContents.length; i++) {
            this.analyzeIfStatements(sourceFile, elifContents[i]);
        }
    }

    private analyzeLeadingComments(sourceFile: SourceFile, block: Block): boolean {
        let commentsRange: CommentRange[] = ts.getLeadingCommentRanges(sourceFile.getText(), block.getPos());

        if (isUndefined(commentsRange)) {
            return true;
        }

        for (let i = 0; i < commentsRange.length; i++) {
            this.extractComment(sourceFile, block, commentsRange[i]);

        }

        return true;
    }

    private extractComment(sourceFile: SourceFile,
                           block: Block,
                           commentRange: CommentRange) {

        let commentText: string = sourceFile.getText().slice(commentRange.pos, commentRange.end);

        console.log('Extracted Comment: ' + commentText); // TODO: parse and check

        let evalRes = DocCommentAnalyzer.analyzeSingleLineComment(commentText);
    }

    private parseComment(sourceFile: SourceFile,
                         block: Block,
                         commentText: string) {

        commentText = commentText.replace(/\//g, '').trim();
        console.log('single line comment Text -> "' + commentText + '"');
        let mixedDoc = ['/**', ' * ' + commentText, '*/'].join('\n');
    }
}