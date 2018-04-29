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
        console.log('@@@@@@@@@@@');
        this.project = new Project({ compilerOptions: { outDir: targetDirectoryPath.toString() } });
        this.project.addExistingSourceFiles(rootDirectoryPath + "/**/*.ts");
        console.log('@@@@@@@@@@@');

        this.init();
    }

    private init() {
        let sourceFiles = this.project.getSourceFiles();

        for (let srcIndex in sourceFiles) {
            let srcFile: SourceFile = sourceFiles[srcIndex];
            console.log("Analyzing " + srcFile.getBaseName());
            console.log(srcFile.getExtension());
            
            if (srcFile.getExtension() == '.ts') {
                TypeScriptVariabilityDetector.analyzeSourceFile(srcFile);
                
            } else if (srcFile.getExtension() == '.html') {
                srcFile.removeText(0, srcFile.getEnd());
            }
        }
        
        const srcDir = this.project.getDirectoryOrThrow(this.rootDirectoryPath.toString());
        // need to specify false here to prevent it from including other files in the directory
        const newDir = srcDir.copy(this.targetDirectoryPath.toString(), { includeUntrackedFiles: false });
        newDir.save();
    }
}
