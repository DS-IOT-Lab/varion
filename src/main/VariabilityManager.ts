import Project, {SourceFile} from "ts-simple-ast";
import * as glob from 'glob';
import * as fs from 'fs';
import {TypeScriptVariabilityDetector} from "./TypeScriptVariabilityDetector";
import {HTMLVariabilityDetector} from "./HTMLVariabilityDetector";
import {ConditionEvaluator} from "./ConditionEvaluator";
import * as path from "path";
import {SourcePathToVariationPointsMap} from "../helper/SourcePathToVariationPointsMap";
import {AbstractVariationPointContainer} from "../helper/variationContainer/AbstractVariationPointContainer";
import {sprintf} from "sprintf-js";
import {SourcePathToHtmlVariationPointsMap} from "../helper/SourcePathToHtmlVariationPointsMap";
import {HtmlVariationPoint} from "../helper/variationContainer/html/implementation/HtmlVariationPoint";
import {VariationPointContainerType} from "../helper/VariationPointContainerType";

let jsonConfig;
let that;

export class VariabilityManager {
    private rootDirectoryPath: String;
    private targetDirectoryPath: String;
    private configurationPath: String;
    private sourceToVariationPointMap: SourcePathToVariationPointsMap = {};

    // maps source file path of html files to HtmlVariationPoint
    // although `sourceToVariationPointMap` contains these files as well,
    // but for the sake of simplicity for applying variation points I thought
    // it's better to have in another place as well
    private sourceToHtmlVps: SourcePathToHtmlVariationPointsMap = {};

    private project: Project;

    constructor(rootDirectoryPath: string, targetDirectoryPath: string, configurationPath: string) {
        this.targetDirectoryPath = path.resolve(targetDirectoryPath);
        this.configurationPath = path.resolve(configurationPath);
        this.rootDirectoryPath = path.resolve(rootDirectoryPath);

        jsonConfig = require(this.configurationPath.toString());
        ConditionEvaluator.init(jsonConfig);


        this.project = new Project({compilerOptions: {outDir: this.targetDirectoryPath.toString()}});
        this.project.addExistingSourceFiles(this.rootDirectoryPath + "/**/*.*");

        this.startAnalyzingTypeScripts();
        this.startAnalyzingHTMLFiles();

    }

    public getSourceToVariationPointsMap(): SourcePathToVariationPointsMap {
        return this.sourceToVariationPointMap;
    }

    public applyVariabilities() {
        for (let sourceFilePath in this.sourceToVariationPointMap) {
            let variationPointsList: Array<AbstractVariationPointContainer> = this.sourceToVariationPointMap[sourceFilePath];

            for (let index in variationPointsList) {
                let variationPointItem = variationPointsList[index];
                if (variationPointItem.getVariationPointType() !== VariationPointContainerType.HTML_CONDITIONAL_TAG
                    && variationPointItem.getVariationPointType() !== VariationPointContainerType.HTML_PRESENCE_TAG) {
                    variationPointItem.applyVariation();
                }
            }
        }

        const srcDir = this.project.getDirectoryOrThrow(this.rootDirectoryPath.toString());
        // need to specify false here to prevent it from including other files in the directory
        const newDir = srcDir.copy(this.targetDirectoryPath.toString(), {
            includeUntrackedFiles: false,
            overwrite: true
        });
        newDir.saveSync();

        // saving htmlVariationPoints
        for (let sourceFilePath in this.sourceToHtmlVps) {
            let variationPointsList: Array<HtmlVariationPoint> = this.sourceToHtmlVps[sourceFilePath];
            let derivedHtml = "";

            for (let index in variationPointsList) {
                let variationPointItem = variationPointsList[index];
                variationPointItem.applyVariation();
                derivedHtml = variationPointItem.getSourceFileText().toString();
            }

            this.printHtmlFiles(derivedHtml, sourceFilePath);
        }


        return;
    }

    private startAnalyzingTypeScripts() {
        let sourceFiles = this.project.getSourceFiles();

        for (let srcIndex in sourceFiles) {
            let srcFile: SourceFile = sourceFiles[srcIndex];

            if (srcFile.getExtension() == '.ts') {
                let tsVariationPoints = TypeScriptVariabilityDetector.analyzeSourceFile(srcFile);
                this.sourceToVariationPointMap[srcFile.getFilePath()] = tsVariationPoints;
            }
        }
    }

    private startAnalyzingHTMLFiles() {
        that = this;
        try {
            let files = glob.sync(this.rootDirectoryPath + '/**/*.html');

            for (let i = 0; i < files.length; i++) {
                let sourceFileText = fs.readFileSync(files[i], 'utf8');

                let variationPoints = HTMLVariabilityDetector.analyzeSourceFile(sourceFileText, files[i]);
                that.sourceToVariationPointMap[files[i]] = variationPoints;
                this.sourceToHtmlVps[files[i]] = variationPoints;
            }

        } catch (e) {
            console.error(e);
        }

    }

    private printHtmlFiles(finalHtmlContent, sourceFilePath) {

        let pathToSave = sourceFilePath.replace(that.rootDirectoryPath, that.targetDirectoryPath);

        fs.writeFileSync(pathToSave, finalHtmlContent, {flag: 'w'});
    }

}
