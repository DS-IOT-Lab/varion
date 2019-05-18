import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";
import {Block, Node, SourceFile, ts} from "ts-simple-ast";
import {CommentRange} from 'typescript';
import {isUndefined} from "util";


export class BlockVariationPoint implements AbstractVariationPointContainer {
    private sourceFile: SourceFile;
    private block: Node;
    private variabilityExp: String = null;
    private isIncludedInSource: Boolean = true;
    private internalVariationPoints: Array<AbstractVariationPointContainer>;

    constructor(sourceFile: SourceFile, node: Node<ts.Block>) {
        this.sourceFile = sourceFile;
        this.block = node as Block;
        this.internalVariationPoints = [];

        this.extractVariationExpression();
    }

    applyVariation(): boolean {
        return false;
    }

    getInternalVariationPoints(): Array<AbstractVariationPointContainer> {
        return undefined;
    }

    getVariationExpression(): String {
        return "";
    }

    getVariationPointState(): Boolean {
        return false;
    }

    printInfo(): String {
        return "";
    }

    setVariationPointState(status: Boolean) {
    }

    variationExpressionContains(conditionExpression: String): boolean {
        return false;
    }

    private extractVariationExpression(): String {
        let commentsRange: CommentRange[] = ts.getLeadingCommentRanges(this.block.getSourceFile().getText(), this.block.getFullStart());

        if (isUndefined(commentsRange)) {
            return null;
        }

        for (let i = 0; i < commentsRange.length; i++) {
            let comment = this.sourceFile.getText().slice(commentsRange[i].pos, commentsRange[i].end);
            if (comment.indexOf('@presence') >= 0) {
                this.variabilityExp = comment;
                return comment;
            }
        }

        return null;
    }

    addToInternalVariationPoint(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }

}