export type CompiledVersions = CompiledVersion[];

export type CompiledVersion = {
  buildId: string;
  itchData?: undefined | ItchData;
  tags: SourceTag[];
};

export type ItchData = {
  itchDate: string;
  itchUrl: string;
};

export type SourceTag = undefined | "wbm";

export type WBMVersions = WBMVersion[];

export type WBMVersion = {
  url: string;
  buildId: string;
  buildDate: string;
};
