export type CompiledVersions = CompiledVersion[];

export type CompiledVersion = {
  archiveData?: ArchiveData | undefined;
  itchData?: ItchData | undefined;
  tags: SourceTag[];
};

export type ArchiveData = {
  timestampUnix: number;
  timestampMilliseconds: number;
};

export type ItchData = {
  buildId: string;
  itchDate: string;
  itchUrl: string;
};

export type SourceTag = undefined | "wbm" | "archive";

export type WBMVersions = WBMVersion[];

export type WBMVersion = {
  url: string;
  buildId: string;
  buildDate: string;
};
