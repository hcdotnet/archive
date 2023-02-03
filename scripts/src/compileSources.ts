import { join } from "path";
import { getKnownBuildDates, getWbmVersions } from "./collectSources";
import { writeFileSync } from "fs";
import { CompiledVersion, CompiledVersions } from "./types";
import { dateFromItchDate, isDateCloseEnough, timeFromItchDate } from "./utils";

const compiledPath = join("sources", "compiled.json");

//region Collecting
console.log("Collecting sources...");

console.log("Resolving known build dates...");
const knownBuildDatesUnix = getKnownBuildDates("./archive/");
const knownBuildDatesMilliseconds = knownBuildDatesUnix.map(
  (date) => date * 1000
);
console.log("Resolved known build dates:");
console.log(knownBuildDatesUnix);

console.log("Resolving WBM versions...");
const wbmVersions = getWbmVersions("./sources/wbm/versions.json");
console.log("Resolved WBM versions:");
console.log(wbmVersions);

console.log("Collected sources!");
//endregion Collecting

//region Compiling
console.log("Compiling sources...");

const compiledVersions: CompiledVersions = [];

// handle WBM versions - needs porting to a grander system later
wbmVersions.forEach((wbmVersion) => {
  const compiledVersion: CompiledVersion = {
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
    if (!version.itchData) return false;
    const itchTime = timeFromItchDate(version.itchData.itchDate);
    return isDateCloseEnough(buildDate, itchTime);
  });
  if (!compiled) {
    compiled = {
      timestampUnix: unix,
      timestampMilliseconds: buildDate,
      tags: ["archive"],
    };
    compiledVersions.push(compiled);
  } else {
    compiled.timestampUnix = unix;
    compiled.timestampMilliseconds = buildDate;
    compiled.tags.push("archive");
  }
});

console.log("Compiled sources!");
//endregion Compiling

console.log("Writing sources...");
writeFileSync(compiledPath, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${compiledPath}"`);
