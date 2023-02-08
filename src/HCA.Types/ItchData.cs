using Newtonsoft.Json;

namespace HCA.Types;

public sealed class ItchData {
    [JsonProperty("buildId")]
    public string BuildId { get; set; } = "";

    [JsonProperty("itchDate")]
    public string ItchDate { get; set; } = "";

    [JsonProperty("itchUrl")]
    public string ItchUrl { get; set; } = "";
}
