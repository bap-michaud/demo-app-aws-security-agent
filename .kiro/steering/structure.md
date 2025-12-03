# Project Structure

## Root Directory

```
.
├── .git/              # Git repository
└── .kiro/             # Kiro configuration
    ├── settings/      # MCP and other settings
    │   └── mcp.json   # MCP server configuration
    ├── specs/         # Feature specifications
    └── steering/      # AI assistant guidance documents
```

## Organization Principles

- **Configuration-first**: Project is primarily configuration-driven using MCP servers
- **No application code**: This is a demo/configuration repository, not a traditional codebase
- **MCP-centric**: All AWS operations are performed through MCP server tools

## Key Files

- `.kiro/settings/mcp.json`: Defines AWS documentation and IAM MCP servers
- `.kiro/steering/*.md`: Guidance documents for AI assistant behavior
- `.kiro/specs/`: Feature specifications for structured development

## Future Structure

As the demo evolves, consider organizing by:

- `docs/`: Documentation and examples
- `examples/`: Sample IAM policies, security configurations
- `scripts/`: Automation scripts for common AWS security tasks
