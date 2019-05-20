import {AbstractVariationPointContainer} from "../../AbstractVariationPointContainer";
import {Block, Node, SourceFile, ts} from "ts-simple-ast";
import {CommentRange} from 'typescript';
import {isUndefined} from "util";
import * as doctrine from 'doctrine';
import {VariationPointContainerType} from "../../../VariationPointContainerType";

export class BlockVariationPoint implements AbstractVariationPointContainer {
    private sourceFile: SourceFile;
    private block: Block;
    private variabilityExp: String = null;
    private isIncludedInSource: Boolean = true;
    private internalVariationPoints: Array<AbstractVariationPointContainer>;

    constructor(sourceFile: SourceFile, node: Node<ts.Block>) {
        this.sourceFile = sourceFile;
        this.block = node as Block;
        this.internalVariationPoints = [];

        this.extractVariationExpression();
    }

    applyVariation() {
        if (!this.isIncludedInSource) {
            this.block.remove();
            return;
        } else {
            if (this.internalVariationPoints.length > 0) {
                for (let internalVariationPointIndex in this.internalVariationPoints) {
                    let internalVariationPoint = this.internalVariationPoints[internalVariationPointIndex];
                    internalVariationPoint.applyVariation();
                }
            }
        }
    }

    getInternalVariationPoints(): Array<AbstractVariationPointContainer> {
        return this.internalVariationPoints;
    }

    getVariationExpression(): String {
        return "";
    }

    getVariationPointState(): Boolean {
        return this.isIncludedInSource;
    }

    setVariationPointState(status: Boolean) {
        this.isIncludedInSource = status;
    }

    printInfo(): String {
        return "";
    }

    variationExpressionContains(conditionExpression: String): boolean {
        return false;
    }

    addToInternalVariationPoints(variationPoint: AbstractVariationPointContainer) {
        this.internalVariationPoints.push(variationPoint);
    }

    getVariationPointType(): VariationPointContainerType {
        return VariationPointContainerType.TS_BLOCK;
    }

    private extractVariationExpression(): String {
        let commentsRange: CommentRange[] = ts.getLeadingCommentRanges(this.block.getSourceFile().getText(), this.block.getFullStart());

        if (isUndefined(commentsRange)) {
            return null;
        }

        for (let i = 0; i < commentsRange.length; i++) {

            // NOTE: `rawComment` contains leading double slashes `//` and we have to remove them
            let rawComment = this.sourceFile.getText().slice(commentsRange[i].pos, commentsRange[i].end);
            if (rawComment.indexOf('@presence') >= 0) {
                let commentText = rawComment.replace(/\//g, '').trim();

                // turn the single rawComment to jsdoc rawComment and parse using doctrine lib
                let parsedDoc = doctrine.parse(['/**', ' * ' + commentText, '*/'].join('\n'), {unwrap: true});

                for (let i = 0; i < parsedDoc.tags.length; i++) {
                    if (parsedDoc.tags[i].title === 'presence') {
                        this.variabilityExp = parsedDoc.tags[i].description;
                    }
                }

                return commentText;
            }
        }

        return null;
    }

}