/**
 * Created by navid on 4/7/18.
 */

import Project, {SourceFile} from "ts-simple-ast";
import {VariabilityDetector} from "./VariabilityDetector";
import {ConditionEvaluator} from "./ConditionEvaluator";
var jsonConfig = require('../configuration/dev-variability.json');

export class VariabilityManager {
    private rootDirectoryPath: String;
    private targetDirectoryPath: String;
    private configurationPath: String;

    private project: Project;

    constructor(rootDirectoryPath: String, targetDirectoryPath: String, configurationPath: String) {
        ConditionEvaluator.init(jsonConfig);
        
        this.targetDirectoryPath = targetDirectoryPath;
        this.configurationPath = configurationPath;
        this.rootDirectoryPath = rootDirectoryPath;
        
        this.project = new Project({compilerOptions: {outDir: targetDirectoryPath.toString()}});
        this.project.addExistingSourceFiles(rootDirectoryPath + "/**/*.ts");

        this.init();
    }

    private init() {
        let sourceFiles = this.project.getSourceFiles();

        for (let srcIndex in sourceFiles) {
            let srcFile: SourceFile = sourceFiles[srcIndex];

            console.log("Analyzing " + srcFile.getBaseNameWithoutExtension());
            VariabilityDetector.analyzeSourceFile(srcFile);
        }

        this.project.emit();
    }
}

let example =  new VariabilityManager('../testScripts', '../dist', '');
