/**
 * Created by navid on 4/7/18.
 */

import Project, { SourceFile } from "ts-simple-ast";
import { TypeScriptVariabilityDetector } from "./TypeScriptVariabilityDetector";
import { ConditionEvaluator } from "./ConditionEvaluator";

var jsonConfig;

export class VariabilityManager {
    private rootDirectoryPath: String;
    private targetDirectoryPath: String;
    private configurationPath: String;

    private project: Project;

    constructor(rootDirectoryPath: string, targetDirectoryPath: string, configurationPath: string) {
        jsonConfig = require(configurationPath);
        ConditionEvaluator.init(jsonConfig);

        this.targetDirectoryPath = targetDirectoryPath;
        this.configurationPath = configurationPath;
        this.rootDirectoryPath = rootDirectoryPath;

        this.project = new Project({ compilerOptions: { outDir: targetDirectoryPath.toString() } });
        this.project.addExistingSourceFiles(rootDirectoryPath + "/**/*.ts");
        this.project.addExistingSourceFiles(rootDirectoryPath + '/**/*.html');

        this.init();
    }

    private init() {
        let sourceFiles = this.project.getSourceFiles();

        for (let srcIndex in sourceFiles) {
            let srcFile: SourceFile = sourceFiles[srcIndex];
            console.log("Analyzing " + srcFile.getBaseName());
            console.log(srcFile.getExtension())
            
            if (srcFile.getExtension() == '.ts') {
                TypeScriptVariabilityDetector.analyzeSourceFile(srcFile);
            } else if (srcFile.getExtension() == '.html') {
                console.log("Analyzing html!");
            }
        }
        this.project.emit();
    }
}
