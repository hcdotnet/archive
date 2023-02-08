using System.IO;
using System.Threading.Tasks;
using CliFx;
using CliFx.Attributes;
using CliFx.Infrastructure;
using HCA.Types;
using HCA.Types.Intermediary;
using JetBrains.Annotations;
using Newtonsoft.Json;

namespace HCA.Console.Commands;

[UsedImplicitly(ImplicitUseKindFlags.InstantiatedNoFixedConstructorSignature)]
[Command("compile-sources", Description = "Compiles sources to a single file.")]
public sealed class CompileSourcesCommand : ICommand {
    [UsedImplicitly(ImplicitUseKindFlags.Access | ImplicitUseKindFlags.Assign)]
    [CommandOption("wbm-path", Description = "WBM archives path.")]
    public string WbmPath { get; init; } =
        Path.Combine("sources", "wbm", "versions.json");

    [UsedImplicitly(ImplicitUseKindFlags.Access | ImplicitUseKindFlags.Assign)]
    [CommandOption("archives", Description = "Archives path.")]
    public string ArchivesPath { get; init; } =
        Path.Combine("sources", "archive");

    [UsedImplicitly(ImplicitUseKindFlags.Access | ImplicitUseKindFlags.Assign)]
    [CommandOption("output", Description = "Output path.", IsRequired = true)]
    public required string Output { get; init; }

    public async ValueTask ExecuteAsync(IConsole console) {
        var wbmVersions = await GetWbmVersions(console);

        if (wbmVersions is null)
            return;

        var archives = await GetArchiveData(console);
        var sources = await CompileSources(console, wbmVersions, archives);

        await console.Output.WriteLineAsync("Writing to: " + Output);
        await File.WriteAllTextAsync(
            Output,
            JsonConvert.SerializeObject(
                sources,
                new JsonSerializerSettings {
                    Formatting = Formatting.Indented,
                    NullValueHandling = NullValueHandling.Ignore,
                }
            )
        );
    }

    private async Task<WbmVersions?> GetWbmVersions(IConsole c) {
        async Task writeLine(string str) => await c.Output.WriteLineAsync(str);

        await writeLine("Compiling sources...");

        await writeLine("Retrieving WBM sources...");
        await writeLine("Using path: " + WbmPath);
        var wbmVersions = SourcesCollector.GetWbmVersions(WbmPath);

        if (wbmVersions is null) {
            await writeLine("Failed to retrieve WBM sources.");
            return null;
        }

        await writeLine("Found " + wbmVersions.Count + " WBM versions.");
        return wbmVersions;
    }

    private async Task<ArchiveData[]> GetArchiveData(IConsole c) {
        async Task writeLine(string str) => await c.Output.WriteLineAsync(str);

        await writeLine("Retrieving archive data...");
        await writeLine("Using path: " + ArchivesPath);
        var archiveData = SourcesCollector.GetArchiveData(ArchivesPath);

        await writeLine("Found " + archiveData.Length + " archives.");
        return archiveData;
    }

    private static async Task<CompiledSources> CompileSources(
        IConsole c,
        WbmVersions wbmVersions,
        ArchiveData[] archives
    ) {
        async Task writeLine(string str) => await c.Output.WriteLineAsync(str);

        await writeLine("Compiling versions...");
        var sources = SourcesCompiler.CompileSources(wbmVersions, archives);

        await writeLine("Compiled " + sources.Count + " sources.");
        return sources;
    }
}
