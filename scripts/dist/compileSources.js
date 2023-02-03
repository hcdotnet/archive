"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const collectSources_1 = require("./collectSources");
const fs_1 = require("fs");
const compiledPath = (0, path_1.join)("sources", "compiled.json");
//region Collecting
console.log("Collecting sources...");
console.log("Resolving WBM versions...");
const wbmVersions = (0, collectSources_1.getWbmVersions)("./sources/wbm/versions.json");
console.log("Resolved WBM versions:");
console.log(wbmVersions);
console.log("Collected sources!");
//endregion Collecting
//region Compiling
console.log("Compiling sources...");
const compiledVersions = [];
// handle WBM versions - needs porting to a grander system later
wbmVersions.forEach((wbmVersion) => {
    const compiledVersion = {
        buildId: wbmVersion.buildId,
        itchData: {
            itchDate: wbmVersion.buildDate,
            itchUrl: wbmVersion.url,
        },
        tags: ["wbm"],
    };
    compiledVersions.push(compiledVersion);
});
console.log("Compiled sources!");
//endregion Compiling
console.log("Writing sources...");
(0, fs_1.writeFileSync)(compiledPath, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${compiledPath}"`);
