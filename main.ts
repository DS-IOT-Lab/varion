import {VariabilityManager} from "./src/main/VariabilityManager.js";


function variability(sourceDirectory, targetDirectory, configFile) {

        sourceDirectory = sourceDirectory.trim();
        targetDirectory = targetDirectory.trim();
        configFile = configFile.trim();

        var invalidArguments = (sourceDirectory == '') || (sourceDirectory == undefined) ||
            (targetDirectory == '') || (targetDirectory == undefined) ||
            (configFile == '') || (configFile == undefined);

        console.log(invalidArguments);

        if (invalidArguments) {
            return 0;
        } else {
            sourceDirectory = sourceDirectory;
            targetDirectory = targetDirectory;
            configFile = configFile;

            let varion = new VariabilityManager(sourceDirectory, targetDirectory, configFile);

            varion.applyVariabilities();
        }
}

variability('/home/navid/dev/Varion/src/testScripts'
    , '/home/navid/Desktop/target'
    , '/home/navid/dev/Varion/src/configuration/dev-variability.json'
);