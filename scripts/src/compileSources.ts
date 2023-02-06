import { join } from "path";
import { getArchiveInformation, getWbmVersions } from "./collectSources";
import { writeFileSync } from "fs";
import { ArchiveData, CompiledVersion, CompiledVersions } from "./types";
import { timeFromItchDate } from "./utils";

const COMPILED_PATH = join("sources", "compiled.json");
const BUILD_DATE_THRESHOLD = 12 * 60 * 60 * 1000; // 30 minutes

//region Collecting
console.log("Collecting sources...");

console.log("Resolving archive information...");
const archiveInfo = getArchiveInformation("./archive/");
console.log("Resolved archive information:");
console.log(archiveInfo);

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
    itchData: {
      buildId: wbmVersion.buildId,
      itchDate: wbmVersion.buildDate,
      itchUrl: wbmVersion.url,
    },
    tags: ["wbm"],
  };
  compiledVersions.push(compiledVersion);
});

archiveInfo.forEach((info, i) => {
  // match build date to itch.io update time
  let nearestIndex = -1;
  let nearestDistance = Infinity;
  wbmVersions.forEach((wbmVersion, index) => {
    const itchTime = timeFromItchDate(wbmVersion.buildDate);
    const distance = itchTime - info.timestampMilliseconds;
    if (distance > 0 && distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  console.log(nearestIndex, nearestDistance);

  let compiled: CompiledVersion = {
    archiveData: info,
    tags: ["archive"],
  };
  if (nearestDistance <= BUILD_DATE_THRESHOLD) {
    compiled = compiledVersions[nearestIndex];
    compiled.archiveData = info;
    compiled.tags.push("archive");
  } else {
    compiledVersions.push(compiled);
  }
});

console.log("Compiled sources!");
//endregion Compiling

console.log("Writing sources...");
writeFileSync(COMPILED_PATH, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${COMPILED_PATH}"`);
