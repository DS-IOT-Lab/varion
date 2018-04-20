import {
    ts,
    Node,
    Block,
    JSDoc,
    JSDocTag,
    Decorator,
    SourceFile,
    SyntaxKind,
    IfStatement,
    DoStatement,
    ForStatement,
    SwitchStatement,
    WhileStatement,
    ClassDeclaration,
    MethodDeclaration,
    ImportDeclaration,
} from 'ts-simple-ast';

import {CommentRange} from 'typescript';
import * as doctrine from 'doctrine';

import {ConditionEvaluator} from '../ConditionEvaluator';
import {Analyzer} from './Analyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import {isUndefined} from 'util';

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
                    this.analyzeDoStatement(sourceFile, node as DoStatement);
                    break;

                case SyntaxKind.WhileStatement:
                    this.analyzeWhileStatement(sourceFile, node as WhileStatement);
                    break;

                case SyntaxKind.ForStatement:
                    this.analyzeForStatement(sourceFile, node as ForStatement);
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
            // NOTE: reverse it since removal api bug might delete a single comment below the block and cause some additional bugs
            let blockContents: Node[] = block.getChildren()[1].getChildren().reverse();    // getting 'SyntaxList' children

            for (let i = 0; i < blockContents.length; i++) {
                this.traverseBlockContent(sourceFile, blockContents[i]);
            }
        } else if (!isIncluded) {
            block.remove();
        }
    }

    private analyzeIfStatements(sourceFile: SourceFile, ifStatement: IfStatement) {
        console.log('Analyzing If-Statement ...');
        let blockContents: Block[] = ifStatement.getChildrenOfKind(SyntaxKind.Block);
        let elifContents: IfStatement[] = ifStatement.getChildrenOfKind(SyntaxKind.IfStatement);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i]);
        }

        for (let i = 0; i < elifContents.length; i++) {
            this.analyzeIfStatements(sourceFile, elifContents[i]);
        }
    }

    private analyzeWhileStatement(sourceFile: SourceFile, whileStatement: WhileStatement) {
        console.log('Analyzing While-Statement ...');
        let blockContents: Block[] = whileStatement.getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i]);
        }
    }

    private analyzeDoStatement(sourceFile: SourceFile, doStatement: DoStatement) {
        console.log('Analyzing Do-Statement ...');
        let blockContents: Block[] = doStatement.getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i]);
        }
    }

    private analyzeForStatement(sourceFile: SourceFile, forStatement: ForStatement) {
        //TODO: implement
    }


    private analyzeLeadingComments(sourceFile: SourceFile, block: Block): boolean {
        let commentsRange: CommentRange[] = ts.getLeadingCommentRanges(sourceFile.getText(), block.getPos());

        if (isUndefined(commentsRange)) {
            return true;
        }

        for (let i = 0; i < commentsRange.length; i++) {
            let isIncluded = this.extractComment(sourceFile, block, commentsRange[i]);

            if (!isIncluded) {
                return false;
            }
        }

        return true;
    }

    private extractComment(sourceFile: SourceFile,
                           block: Block,
                           commentRange: CommentRange) {

        let commentText: string = sourceFile.getText().slice(commentRange.pos, commentRange.end);

        console.log('Extracted Comment: ' + commentText); // TODO: parse and check

        return DocCommentAnalyzer.analyzeSingleLineComment(commentText);

    }

    private parseComment(sourceFile: SourceFile,
                         block: Block,
                         commentText: string) {

        commentText = commentText.replace(/\//g, '').trim();
        console.log('single line comment Text -> "' + commentText + '"');
        let mixedDoc = ['/**', ' * ' + commentText, '*/'].join('\n');
    }
}