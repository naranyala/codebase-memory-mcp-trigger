# codebase-memory-mcp-trigger

A specialized Pi extension designed to bridge the [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) binary with the Pi coding agent.

This extension provides a seamless way for the agent to interact with your codebase's structural memory, allowing it to perform complex graph queries, search code patterns, and understand architecture through a native command.

## Why this extension?

While the [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) binary is a powerful tool for indexing and querying codebases, it is designed as a standalone CLI. 

Without this extension, a Pi agent can only "know" about the binary if it happens to run it via `bash`. However, the agent often lacks the explicit instruction or the structured way to handle the output of such a specialized tool effectively.

**This extension bridges that gap by:**
- **Explicit Tooling**: It registers the binary as a first-class `/codebase-memory-mcp` slash command, making it part of the agent's standard toolkit.
- **Structured Context Injection**: It ensures that every bit of data returned by the binary is piped directly back into the agent's conversation context, allowing the LLM to "see" the graph and architecture results immediately.
- **Real-time Visibility**: It streams the raw logs to your terminal while simultaneously feeding the cleaned data to the agent, giving you the best of both worlds: full observability and automated intelligence.

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
