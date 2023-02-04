import { join } from "path";
import { getArchiveInformation, getWbmVersions } from "./collectSources";
import { writeFileSync } from "fs";
import { ArchiveData, CompiledVersion, CompiledVersions } from "./types";
import { timeFromItchDate } from "./utils";

const COMPILED_PATH = join("sources", "compiled.json");
const BUILD_DATE_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours

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

const stragglers: ArchiveData[] = [];
archiveInfo.forEach((info, i) => {
  // match build date to itch.io update time
  let nearestIndex = -1;
  let nearestDistance = Infinity;
  wbmVersions.forEach((wbmVersion, index) => {
    const itchTime = timeFromItchDate(wbmVersion.buildDate);
    const distance = Math.abs(info.timestampMilliseconds - itchTime);
    if (distance < nearestDistance) {
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

    let add = true;

    if (
      compiled.archiveData &&
      compiled.archiveData.timestampUnix &&
      compiled.archiveData.timestampMilliseconds
    ) {
      if (compiled.archiveData.timestampUnix > info.timestampUnix) {
        stragglers.push(info);
      } else {
        add = false;
      }
    }

    if (add) {
      compiled.archiveData = info;
      compiled.tags.push("archive");
    }
  } else {
    compiledVersions.push(compiled);
  }
});

stragglers.forEach((straggler, i) => {
  // filter, only uniques
  if (stragglers.indexOf(straggler) !== i) return;

  compiledVersions.push({
    archiveData: straggler,
    tags: ["archive"],
  });
});

console.log("Compiled sources!");
//endregion Compiling

console.log("Writing sources...");
writeFileSync(COMPILED_PATH, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${COMPILED_PATH}"`);
