# codebase-memory-mcp-trigger

A specialized Pi extension designed to bridge the [codebase-memory-mcp](https://github.com/naranyala/codebase-memory-mcp) binary with the Pi coding agent.

This extension provides a seamless way for the agent to interact with your codebase's structural memory, allowing it to perform complex graph queries, search code patterns, and understand architecture through a native command.

## Installation

Install directly from GitHub:

```bash
pi install git:https://github.com/naranyala/codebase-memory-mcp-trigger
```

## How It Works

This extension acts as a lightweight bridge. When you invoke the command, it:

1.  **Captures Arguments**: Takes any arguments provided by the agent or user.
2.  **Executes Binary**: Spawns the `codebase-memory-mcp` process in your system's environment.
3.  **Stream Logs**: Pipes the raw `stdout` and `stderr` directly to your terminal for real-time visibility.
4.  **Informs the Agent**: Automatically feeds the resulting output back into the agent's context so it can use the data to answer questions or write code.

## Usage

Once installed, you can trigger the tool directly in any Pi session:

```bash
/codebase-memory-mcp <tool> [args]
```

### Example Commands

- **Index a project**: `/codebase-memory-mcp cli index_repository`
- **Search the graph**: `/codebase-memory-mcp cli search_graph '{"query": "my_function"}'`
- **Check status**: `/codebase-memory-mcp cli index_status`
- **Get help**: `/codebase-memory-mcp` (defaults to `--help`)

## Requirements

- The `codebase-memory-mcp` binary must be installed and available in your system's `PATH`.
