import {InterfaceDeclaration, Node, SourceFile, ts} from "ts-simple-ast";
import {Analyzer} from './Analyzer';
import {DocCommentAnalyzer} from './DocCommentAnalyzer';
import {VariationPointStatus} from "../../helper/VariationPointStatus";

export class InterfaceAnalyzer extends Analyzer {
    private static instance: InterfaceAnalyzer;

    private constructor() {
        super();
    }

    public static getInstance(): InterfaceAnalyzer {
        if (InterfaceAnalyzer.instance == null) {
            InterfaceAnalyzer.instance = new InterfaceAnalyzer();
        }

        return InterfaceAnalyzer.instance;
    }

    public analyze(sourceFile: SourceFile, node: Node<ts.InterfaceDeclaration>) {
        let interfaceDec: InterfaceDeclaration;
        interfaceDec = node as InterfaceDeclaration;

        let jsDocs = interfaceDec.getJsDocs();
        let variationRes: VariationPointStatus;

        for (let i = 0; i < jsDocs.length; i++) {
            variationRes = DocCommentAnalyzer.analyzeJsDoc(jsDocs[i]);
        }
    }


    private removeInterace
    (sourceFile: SourceFile, interfaceDec: InterfaceDeclaration) {
        console.log('Removing interface initiation sequence: (#Inteface, '
            + interfaceDec.getName()
            + ', '
            + interfaceDec.getPos()
            + ', '
            + interfaceDec.getEnd()
            + ')');

        // removing JS-Docs
        console.log('1- Removing ' + interfaceDec.getName() + ' JS Docs:');
        let jsDocs = interfaceDec.getJsDocs();
        for (let i = 0; i < jsDocs.length; i++) {
            console.log('2-' + i + ') Removing JSDoc: (#JSDoc,'
                + jsDocs[i].getPos()
                + ', '
                + jsDocs[i].getEnd()
                + ')');

            jsDocs[i].remove();
        }

        // removing interface itself
        console.log('2- Removing interface: ' + interfaceDec.getName());
        interfaceDec.remove();
    }

}