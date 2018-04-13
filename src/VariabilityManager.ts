/**
 * Created by navid on 4/7/18.
 */
import Project, {SourceFile} from "ts-simple-ast";
import {VariabilityDetector} from "./VariabilityDetector";
import {ConditionEvaluator} from "./ConditionEvaluator";

export class VariabilityManager {
    private rootDirectoryPath: String;
    private targetDirectoryPath: String;
    private configurationPath: String;

    private project: Project;

    constructor(rootDirectoryPath: String, targetDirectoryPath: String, configurationPath: String) {
        // TODO:
        ConditionEvaluator.init('{"f1": true, "g2": false, "f3": true, "f4": false}');

        this.targetDirectoryPath = targetDirectoryPath;
        this.configurationPath = configurationPath;
        this.rootDirectoryPath = rootDirectoryPath;
        
        
        this.project = new Project({compilerOptions: {outDir: 'dist'}});
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

let example =  new VariabilityManager("../../testScripts", '', '');

