using System;
using System.Collections.Generic;
using System.IO;
using HCA.Types;
using HCA.Types.Intermediary;
using Newtonsoft.Json;

namespace HCA;

public static class SourcesCollector {
    public static WbmVersions? GetWbmVersions(string path) {
        return JsonConvert.DeserializeObject<WbmVersions>(
            File.ReadAllText(path)
        );
    }

    public static ArchiveData[] GetArchiveData(string path) {
        var dir = new DirectoryInfo(path);
        var archives = dir.GetFiles("*", SearchOption.TopDirectoryOnly);
        var data = new List<ArchiveData>();

        foreach (var archive in archives) {
            var split = archive.Name.Split(".");
            var tsStr = split[^2];

            if (!int.TryParse(tsStr, out var timestamp))
                throw new Exception("Could not parse timestamp: " + tsStr);

            data.Add(new ArchiveData {
                TimestampUnix = timestamp,
                TimestampMilliseconds = (ulong) timestamp * 1000,
                ArchiveName = archive.Name,
            });
        }

        return data.ToArray();
    }
}
