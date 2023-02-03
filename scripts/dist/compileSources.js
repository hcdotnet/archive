"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const collectSources_1 = require("./collectSources");
const fs_1 = require("fs");
const utils_1 = require("./utils");
const compiledPath = (0, path_1.join)("sources", "compiled.json");
//region Collecting
console.log("Collecting sources...");
console.log("Resolving known build dates...");
const knownBuildDatesUnix = (0, collectSources_1.getKnownBuildDates)("./archive/");
const knownBuildDatesMilliseconds = knownBuildDatesUnix.map((date) => date * 1000);
console.log("Resolved known build dates:");
console.log(knownBuildDatesUnix);
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
        timestampUnix: undefined,
        timestampMilliseconds: undefined,
    };
    compiledVersions.push(compiledVersion);
});
knownBuildDatesMilliseconds.forEach((buildDate, i) => {
    const unix = knownBuildDatesUnix[i];
    // match build date to itch.io update time
    let compiled = compiledVersions.find((version) => {
        if (!version.itchData)
            return false;
        const itchTime = (0, utils_1.timeFromItchDate)(version.itchData.itchDate);
        return (0, utils_1.isDateCloseEnough)(itchTime, buildDate);
    });
    if (!compiled) {
        compiled = {
            timestampUnix: unix,
            timestampMilliseconds: buildDate,
            tags: ["archive"],
        };
        compiledVersions.push(compiled);
    }
    else {
        compiled.timestampUnix = unix;
        compiled.timestampMilliseconds = buildDate;
        compiled.tags.push("archive");
    }
});
console.log("Compiled sources!");
//endregion Compiling
console.log("Writing sources...");
(0, fs_1.writeFileSync)(compiledPath, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${compiledPath}"`);
