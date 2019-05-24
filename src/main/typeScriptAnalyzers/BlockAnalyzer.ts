import {
    Block,
    DoStatement,
    ForStatement,
    IfStatement,
    Node,
    SourceFile,
    SwitchStatement,
    SyntaxKind,
    ts,
    WhileStatement,
} from 'ts-simple-ast';
import {CommentRange} from 'typescript';
import {Analyzer} from './Analyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import {isUndefined} from 'util';
import {AbstractVariationPointContainer} from "../../helper/variationContainer/AbstractVariationPointContainer";
import {BlockVariationPoint} from "../../helper/variationContainer/typescript/implementation/BlockVariationPoint";
import {VariationPointStatus} from "../../helper/VariationPointStatus";

const BLOCK_CONTAINING_NODES: Array<SyntaxKind> =
    [SyntaxKind.IfStatement
        , SyntaxKind.WhileStatement
        , SyntaxKind.DoStatement
        , SyntaxKind.Block
        , SyntaxKind.ForStatement];

export class BlockAnalyzer extends Analyzer {

    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {Block} node
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    public analyze(sourceFile: SourceFile, node: Block, containerVariationPoint: AbstractVariationPointContainer) {
        this.analyzeBlock(sourceFile, node, containerVariationPoint);
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {Node} node
     * @param {AbstractVariationPointContainer} containerVariationPoint
     * @returns {boolean}
     */
    public traverseBlockContent(sourceFile: SourceFile
        , node: Node
        , containerVariationPoint: AbstractVariationPointContainer) {
        if (BLOCK_CONTAINING_NODES.indexOf(node.getKind()) != -1) {

            switch (node.getKind()) {
                case SyntaxKind.Block:
                    this.analyzeBlock(sourceFile, node as Block, containerVariationPoint);
                    break;

                case SyntaxKind.IfStatement:
                    this.analyzeIfStatements(sourceFile, node as IfStatement, containerVariationPoint);
                    break;

                case SyntaxKind.DoStatement:
                    this.analyzeDoStatement(sourceFile, node as DoStatement, containerVariationPoint);
                    break;

                case SyntaxKind.WhileStatement:
                    this.analyzeWhileStatement(sourceFile, node as WhileStatement, containerVariationPoint);
                    break;

                case SyntaxKind.ForStatement:
                    this.analyzeForStatement(sourceFile, node as ForStatement, containerVariationPoint);
                    break;
            }
        }

        return false; // FIXME: fix here!
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {Block} block
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeBlock(sourceFile: SourceFile
        , block: Block
        , containerVariationPoint: AbstractVariationPointContainer) {

        // first check the block it self!
        let variationRes = this.analyzeLeadingComments(sourceFile, block);
        let currentBlockVariationPoint: BlockVariationPoint = new BlockVariationPoint(sourceFile, block);

        containerVariationPoint.addToInternalVariationPoints(currentBlockVariationPoint);
        currentBlockVariationPoint.setVariationPointState(variationRes);


        // NOTE: reverse it since removal api bug might delete a single comment below the block and cause some additional bugs
        let blockContents: Node[] = block.getChildren()[1].getChildren().reverse();    // getting 'SyntaxList' children

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i], currentBlockVariationPoint);
        }
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {IfStatement} ifStatement
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeIfStatements(sourceFile: SourceFile
        , ifStatement: IfStatement
        , containerVariationPoint: AbstractVariationPointContainer) {

        let blockContents: Block[] = ifStatement.getChildrenOfKind(SyntaxKind.Block);
        let elifContents: IfStatement[] = ifStatement.getChildrenOfKind(SyntaxKind.IfStatement);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i], containerVariationPoint);
        }

        for (let i = 0; i < elifContents.length; i++) {
            this.analyzeIfStatements(sourceFile, elifContents[i], containerVariationPoint);
        }
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {WhileStatement} whileStatement
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeWhileStatement(sourceFile: SourceFile
        , whileStatement: WhileStatement
        , containerVariationPoint: AbstractVariationPointContainer) {

        let blockContents: Block[] = whileStatement.getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i], containerVariationPoint);
        }
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {DoStatement} doStatement
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeDoStatement(sourceFile: SourceFile
        , doStatement: DoStatement
        , containerVariationPoint: AbstractVariationPointContainer) {
        let blockContents: Block[] = doStatement.getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i], containerVariationPoint);
        }
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {SwitchStatement} swtichStatement
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeSwitchStatement(sourceFile: SourceFile
        , switchStatement: SwitchStatement
        , containerVariationPoint: AbstractVariationPointContainer) {
        //TODO: implement...
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {ForStatement} forStatement
     * @param {AbstractVariationPointContainer} containerVariationPoint
     */
    private analyzeForStatement(sourceFile: SourceFile
        , forStatement: ForStatement
        , containerVariationPoint: AbstractVariationPointContainer) {
        let blockContents: Block[] = forStatement.getChildrenOfKind(SyntaxKind.Block);

        for (let i = 0; i < blockContents.length; i++) {
            this.traverseBlockContent(sourceFile, blockContents[i], containerVariationPoint);
        }
    }

    /**
     * TODO: document!!
     * @param {SourceFile} sourceFile
     * @param {Block} block
     * @returns {VariationPointStatus}
     */
    private analyzeLeadingComments(sourceFile: SourceFile, block: Block): VariationPointStatus {
        let commentsRange: CommentRange[] = ts.getLeadingCommentRanges(block.getSourceFile().getText(), block.getFullStart());

        // if there is no leading comment for the block then we can assume it should be included in the final product
        if (isUndefined(commentsRange)) {
            return VariationPointStatus.INCLUDED;
        }

        for (let i = 0; i < commentsRange.length; i++) {
            return this.extractComment(sourceFile, block, commentsRange[i]);
        }

        return VariationPointStatus.INCLUDED;
    }


    /**
     * TODO: document!
     * @param {SourceFile} sourceFile
     * @param {Block} block
     * @param {ts.CommentRange} commentRange
     * @returns {VariationPointStatus}
     */
    private extractComment(sourceFile: SourceFile
        , block: Block
        , commentRange: CommentRange): VariationPointStatus {

        let commentText: string = sourceFile.getText().slice(commentRange.pos, commentRange.end);
        return DocCommentAnalyzer.analyzeSingleLineComment(commentText);
    }

}