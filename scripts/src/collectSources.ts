/* Collects version information from sources and compiled them into a cohesive list. */

import { readFileSync, readdirSync } from "fs";
import { ArchiveData, WBMVersions } from "./types";

export function getWbmVersions(path: string): WBMVersions {
  return JSON.parse(readFileSync(path, "utf8")) as WBMVersions;
}

export function getArchiveInformation(path: string): ArchiveData[] {
  const archives = readdirSync(path);
  const data: ArchiveData[] = [];

  archives.forEach((archive) => {
    const split = archive.split(".");
    const timestamp = Number(split[split.length - 2]);
    data.push({
      timestampUnix: timestamp,
      timestampMilliseconds: timestamp * 1000,
      archiveName: archive,
    });
  });
  return data;
}
