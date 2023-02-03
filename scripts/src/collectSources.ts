/* Collects version information from sources and compiled them into a cohesive list. */

import { readFileSync } from "fs";
import { WBMVersions } from "./types";

export function getWbmVersions(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as WBMVersions;
}
