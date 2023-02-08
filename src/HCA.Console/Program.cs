using CliFx;

return await new CliApplicationBuilder()
             .SetDescription("holocure-archive utility tool")
             .AddCommandsFromThisAssembly()
             .Build()
             .RunAsync(args);
