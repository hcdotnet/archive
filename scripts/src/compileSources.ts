import { join } from "path";
import { getWbmVersions } from "./collectSources";
import { writeFileSync } from "fs";
import { CompiledVersion, CompiledVersions } from "./types";

const compiledPath = join("sources", "compiled.json");

//region Collecting
console.log("Collecting sources...");

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
  };
  compiledVersions.push(compiledVersion);
});

console.log("Compiled sources!");
//endregion Compiling

console.log("Writing sources...");
writeFileSync(compiledPath, JSON.stringify(compiledVersions, null, 2));
console.log(`Sources written to: "${compiledPath}"`);
