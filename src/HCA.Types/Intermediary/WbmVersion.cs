using Newtonsoft.Json;

namespace HCA.Types.Intermediary;

public sealed class WbmVersion {
    [JsonProperty("url")]
    public string Url { get; set; } = "";

    [JsonProperty("buildId")]
    public string BuildId { get; set; } = "";

    [JsonProperty("buildDate")]
    public string BuildDate { get; set; } = "";
}
