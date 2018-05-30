/**
 * Created by navid on 4/7/18.
 */

import Project, { SourceFile } from "ts-simple-ast";
import * as glob from 'glob';
import * as fs from 'fs';
import { TypeScriptVariabilityDetector } from "./TypeScriptVariabilityDetector";
import {HTMLVariabilityDetector} from "./HTMLVariabilityDetector";
import { ConditionEvaluator } from "./ConditionEvaluator";
import chalk from "chalk";
import * as path from "path";


let htmlDerivedFiles: Array<HtmlSource> = [];
var jsonConfig;
let that;

export class VariabilityManager {
    private rootDirectoryPath: String;
    private targetDirectoryPath: String;
    private configurationPath: String;

    private project: Project;

    constructor(rootDirectoryPath: string, targetDirectoryPath: string, configurationPath: string) {
        
        
        this.targetDirectoryPath = path.resolve(__dirname + targetDirectoryPath);
        this.configurationPath = path.resolve(__dirname + configurationPath);
        this.rootDirectoryPath = path.resolve(__dirname + rootDirectoryPath);
        
        jsonConfig = require(this.configurationPath.toString());
        ConditionEvaluator.init(jsonConfig);
        
        
        this.project = new Project({ compilerOptions: { outDir: this.targetDirectoryPath.toString() } });
        this.project.addExistingSourceFiles(this.rootDirectoryPath + "/**/*.ts");
        
        this.startAnalyzingTypeScripts();
        this.startAnalyzingHTMLFiles();
    }

    private startAnalyzingTypeScripts() {
        let sourceFiles = this.project.getSourceFiles();

        for (let srcIndex in sourceFiles) {
            let srcFile: SourceFile = sourceFiles[srcIndex];
            console.log("Analyzing " + srcFile.getBaseName());

            if (srcFile.getExtension() == '.ts') {
                TypeScriptVariabilityDetector.analyzeSourceFile(srcFile);
            }
        }

        const srcDir = this.project.getDirectoryOrThrow(this.rootDirectoryPath.toString());
        // need to specify false here to prevent it from including other files in the directory
        const newDir = srcDir.copy(this.targetDirectoryPath.toString(), { includeUntrackedFiles: false });
        newDir.save();
    }

    private startAnalyzingHTMLFiles() {
        that = this;
        glob(this.rootDirectoryPath + '/**/*.html', this.htmlCallback);
    }

    private htmlCallback(error, files) {

        for (let i = 0; i < files.length; i++) {
            let sourceFileText = fs.readFileSync(files[i], 'utf8');
            let derivedSource = HTMLVariabilityDetector.analyzeSourceFile(sourceFileText, files[i]);

            htmlDerivedFiles.push(new HtmlSource(files[i], derivedSource));
        }

        that.printHtmlFiles();
    }

    private printHtmlFiles() {
        for (let i = 0; i < htmlDerivedFiles.length; i++) {
            console.log(chalk.cyan('HTML file path: ') + htmlDerivedFiles[i].getSourcePath());
            let pathToSave =  htmlDerivedFiles[i].getSourcePath().replace(that.rootDirectoryPath, that.targetDirectoryPath);
            console.log(chalk.yellow('New Path: ') + pathToSave);
            console.log(chalk.gray(htmlDerivedFiles[i].getSourceText()));
            
            fs.writeFile(pathToSave, htmlDerivedFiles[i].getSourceText(), () => {});
        }
    }
}

class HtmlSource {
    private sourcePath: string;
    private sourceText: string;

    constructor(sourcePath: string, sourceText: string) {
        this.sourcePath = sourcePath;
        this.sourceText = sourceText;
    }

    public getSourcePath() {
        return this.sourcePath;
    }

    public getSourceText() {
        return this.sourceText;
    }

    public setSourceText(sourceText: string) {
        this.sourceText = sourceText;
    }

    public setSourcePath(sourcePath: string) {
        this.sourcePath = sourcePath;
    }
}