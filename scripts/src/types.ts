export type CompiledVersions = CompiledVersion[];

export type CompiledVersion = {
  timestampUnix: number | undefined;
  timestampMilliseconds: number | undefined;
  itchData?: ItchData | undefined;
  tags: SourceTag[];
};

export type ItchData = {
  buildId?: string | undefined;
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
