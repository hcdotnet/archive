import { join } from "path";
import { getKnownBuildDates, getWbmVersions } from "./collectSources";
import { writeFileSync } from "fs";
import { CompiledVersion, CompiledVersions } from "./types";
import { timeFromItchDate } from "./utils";

const COMPILED_PATH = join("sources", "compiled.json");
const BUILD_DATE_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours

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
    itchData: {
      buildId: wbmVersion.buildId,
      itchDate: wbmVersion.buildDate,
      itchUrl: wbmVersion.url,
    },
    tags: ["wbm"],
  };
  compiledVersions.push(compiledVersion);
});

const stragglers: [number, number][] = [];
knownBuildDatesMilliseconds.forEach((buildDate, i) => {
  const unix = knownBuildDatesUnix[i];

  // match build date to itch.io update time
  let nearestIndex = -1;
  let nearestDistance = Infinity;
  wbmVersions.forEach((wbmVersion, index) => {
    const itchTime = timeFromItchDate(wbmVersion.buildDate);
    const distance = Math.abs(buildDate - itchTime);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  console.log(nearestIndex, nearestDistance);

  let compiled: CompiledVersion = {
    archiveData: {
      timestampUnix: unix,
      timestampMilliseconds: buildDate,
    },
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
      if (compiled.archiveData.timestampUnix > unix) {
        stragglers.push([
          compiled.archiveData.timestampUnix,
          compiled.archiveData.timestampMilliseconds,
        ]);
      } else {
        add = false;
      }
    }

    if (add) {
      compiled.archiveData = {
        timestampUnix: unix,
        timestampMilliseconds: buildDate,
      };
      compiled.tags.push("archive");
    }
  } else {
    compiledVersions.push(compiled);
  }
});

stragglers.forEach((straggler, i) => {
  // filter, only uniques
  if (stragglers.indexOf(straggler) !== i) return;

  const [unix, milliseconds] = straggler;
  compiledVersions.push({
    archiveData: {
      timestampUnix: unix,
      timestampMilliseconds: milliseconds,
    },
    tags: ["archive"],
  });
});

console.log("Compiled sources!");
//endregion Compiling

console.log("Writing sources...");
writeFileSync(COMPILED_PATH, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${COMPILED_PATH}"`);
