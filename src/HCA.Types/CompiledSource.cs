using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HCA.Types;

public sealed class CompiledSource {
    [JsonProperty("itchData")]
    public ItchData? ItchData { get; set; } = null;

    [JsonProperty("archiveData")]
    public ArchiveData? ArchiveData { get; set; } = null!;

    [JsonProperty("tags")]
    public List<string> Tags { get; set; } = new();
}
