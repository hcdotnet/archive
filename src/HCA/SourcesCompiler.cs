using System;
using System.Collections.Generic;
using System.Linq;
using HCA.Types;
using HCA.Types.Intermediary;

namespace HCA;

public static class SourcesCompiler {
    private static readonly TimeSpan time_threshold = TimeSpan.FromMinutes(30);

    public static CompiledSources CompileSources(
        WbmVersions wbmVersions,
        ArchiveData[] archives
    ) {
        var sources = new CompiledSources();
        sources.AddRange(wbmVersions.Select(wbmVersion => new CompiledSource {
            ItchData = new ItchData {
                BuildId = wbmVersion.BuildId,
                ItchDate = wbmVersion.BuildDate,
                ItchUrl = wbmVersion.Url,
            },
            Tags = new List<string> {
                "wbm",
            },
        }));

        var archivesUsed = new bool[archives.Length];

        for (var i = 0; i < archives.Length; i++) {
            archivesUsed[i] = false;
            var archive = archives[i];
            var archiveDate = DateHandler.FromSeconds(archive.TimestampUnix);

            foreach (var source in sources) {
                var itchData = source.ItchData!;
                var wbmDate = DateHandler.FromItchDate(itchData.ItchDate);

                // sensible logic would dictate that archiveDate will always be
                // less than wbmDate, assuming the times actually match. because
                // how would you upload a version of the game before you compile
                // it? sanity checks sanity checks sanity checks! + ez filtering
                var timeDiff = wbmDate - archiveDate;
                if (timeDiff < TimeSpan.Zero || timeDiff > time_threshold)
                    continue;

                source.ArchiveData = archive;
                source.Tags.Add("archive");
                archivesUsed[i] = true;
            }
        }

        for (var i = 0; i < archivesUsed.Length; i++) {
            if (archivesUsed[i])
                continue;

            sources.Add(new CompiledSource {
                ArchiveData = archives[i],
                Tags = new List<string> {
                    "archive",
                }
            });
        }

        return sources;
    }
}
