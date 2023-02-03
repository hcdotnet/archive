"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const collectSources_1 = require("./collectSources");
const fs_1 = require("fs");
const utils_1 = require("./utils");
const COMPILED_PATH = (0, path_1.join)("sources", "compiled.json");
const BUILD_DATE_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours
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
const stragglers = [];
knownBuildDatesMilliseconds.forEach((buildDate, i) => {
    const unix = knownBuildDatesUnix[i];
    // match build date to itch.io update time
    let nearestIndex = -1;
    let nearestDistance = Infinity;
    wbmVersions.forEach((wbmVersion, index) => {
        const itchTime = (0, utils_1.timeFromItchDate)(wbmVersion.buildDate);
        const distance = Math.abs(buildDate - itchTime);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
        }
    });
    console.log(nearestIndex, nearestDistance);
    let compiled = {
        timestampUnix: unix,
        timestampMilliseconds: buildDate,
        tags: ["archive"],
    };
    if (nearestDistance <= BUILD_DATE_THRESHOLD) {
        compiled = compiledVersions[nearestIndex];
        let add = true;
        if (compiled.timestampUnix && compiled.timestampMilliseconds) {
            if (compiled.timestampUnix > unix) {
                stragglers.push([
                    compiled.timestampUnix,
                    compiled.timestampMilliseconds,
                ]);
            }
            else {
                add = false;
            }
        }
        if (add) {
            compiled.timestampUnix = unix;
            compiled.timestampMilliseconds = buildDate;
            compiled.tags.push("archive");
        }
    }
    else {
        compiledVersions.push(compiled);
    }
});
stragglers.forEach((straggler, i) => {
    // filter, only uniques
    if (stragglers.indexOf(straggler) !== i)
        return;
    const [unix, milliseconds] = straggler;
    compiledVersions.push({
        timestampUnix: unix,
        timestampMilliseconds: milliseconds,
        tags: ["archive"],
    });
});
console.log("Compiled sources!");
//endregion Compiling
console.log("Writing sources...");
(0, fs_1.writeFileSync)(COMPILED_PATH, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${COMPILED_PATH}"`);
