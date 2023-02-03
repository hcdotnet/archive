/* Collects version information from sources and compiled them into a cohesive list. */

import { readFileSync, readdirSync } from "fs";
import { WBMVersions } from "./types";

export function getWbmVersions(path: string): WBMVersions {
  return JSON.parse(readFileSync(path, "utf8")) as WBMVersions;
}

export function getKnownBuildDates(path: string): number[] {
  const archives = readdirSync(path);
  const buildDates: number[] = [];

  archives.forEach((archive) => {
    const split = archive.split(".");
    buildDates.push(Number(split[split.length - 2]));
  });
  return buildDates;
}
