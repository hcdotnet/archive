using Newtonsoft.Json;

namespace HCA.Types;

public sealed class ArchiveData {
    [JsonProperty("timestampUnix")]
    public long TimestampUnix { get; set; }

    [JsonProperty("timestampMilliseconds")]
    public ulong TimestampMilliseconds { get; set; }

    [JsonProperty("archiveName")]
    public string ArchiveName { get; set; } = "";
}
