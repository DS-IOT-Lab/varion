import {VariabilityManager} from "./src/main/VariabilityManager.js";
import * as path from "path";


module.exports = function (sourceDirectory, targetDirectory, configFile, callback) {
    
    return new Promise((resolve, reject) => {
        sourceDirectory = sourceDirectory.trim();
        targetDirectory = targetDirectory.trim();
        configFile = configFile.trim();
        
        var invalidArguments = (sourceDirectory == '') || (sourceDirectory == undefined) ||
                        (targetDirectory == '') || (targetDirectory == undefined) ||
                        (configFile == '') || (configFile == undefined);
                        
        console.log(invalidArguments);
        
        if (invalidArguments) {
            reject('one of the given paths is not valid');
            return callback('one of the given paths is not valid');
        } else {
            sourceDirectory = path.join(__dirname, sourceDirectory);
            targetDirectory = path.join(__dirname, targetDirectory);
            configFile = path.join(__dirname, configFile);
            
            var varion = new VariabilityManager(sourceDirectory, targetDirectory, configFile);
        }
    });
}