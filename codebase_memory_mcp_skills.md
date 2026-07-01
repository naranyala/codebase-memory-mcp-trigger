# codebase-memory-mcp Skills Guide

## Overview
`codebase-memory-mcp` is a high-fidelity codebase memory engine. It transforms raw source code into a searchable, queryable graph of semantic relationships (calls, imports, definitions, types, etc.).

## Core Workflow
1.  **Discover/Identify**: Use `list_projects` to see what's already indexed.
2.  **Index**: If the current project is missing, use `index_repository`.
3.  **Explore**: Use `get_architecture` for a bird's eye view, or `search_code` to find specific implementations.
4.  **Analyze**: Use `query_graph` or `trace_path` to understand complex dependencies or flows.

## Tool Catalog

### Discovery & Management
- `list_projects`: Returns a JSON list of all indexed projects. **Use this first to find the correct `project` name.**
- `index_status`: Check if a project is indexed and its health.
- `index_repository(repo_path: string)`: The entry point. Scans the path and builds the graph.
- `delete_project(project: string)`: Wipes a project from memory.
- `detect_changes`: Finds diffs between the current disk state and the index.

### Search & Retrieval
- `search_code(project: string, pattern: string)`: Fast text-based search within indexed files.
- `search_graph(project: string, query: object)`: Semantic search across the graph nodes/edges.
- `get_code_snippet(project: string, node_id: string)`: Gets the exact source code for a specific symbol/node.
- `query_graph(project: string, query: object)`: Execute complex graph queries (Cypher-like or JSON).

### Architecture & Flow
- `get_architecture(project: string, aspects: string[])`: High-level overview of patterns and structure.
- `trace_path(project: string, start_node: string, end_node: string)`: Shows the call/dependency chain between two points.
- `get_graph_schema(project: string)`: Inspects the properties and labels available in the graph.

### Advanced Context
- `manage_adr(project: string, mode: 'store'|'list'|'get', content?: string)`: Persist architectural decisions.
- `ingest_traces(project: string, trace_data: object)`: Add runtime execution flow to the static graph.

## Pro-Tips for Agents
- **The Project Name Trap**: Most tools require a `project` name. This is NOT the file path; it's the name returned by `list_projects`. Always run `list_projects` before attempting a search or query.
- **Start Big, Then Zoom**: Use `get_architecture` $\rightarrow$ `search_code` $\rightarrow$ `get_code_snippet` $\rightarrow$ `trace_path`.
- **JSON Formatting**: Most tool arguments are JSON strings. Ensure strict JSON compliance when passing arguments via the CLI.
- **Error Handling**: If a command fails with "project not found", check `list_projects`. If it fails with "repo_path is required", ensure you are passing `{"repo_path": "..."}`.
