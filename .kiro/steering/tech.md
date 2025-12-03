# Technology Stack

## MCP Servers

This project uses Model Context Protocol (MCP) servers for AWS integration:

- **aws-documentation-mcp-server**: Access AWS documentation
- **iam-mcp-server**: IAM user, role, policy, and group management

## MCP Configuration

MCP servers are configured in `.kiro/settings/mcp.json` and run via `uvx` (Python package runner).

## Common Commands

### MCP Server Management

```bash
# Reconnect MCP servers (use Command Palette: "MCP: Reconnect Server")
# View MCP tools (use Kiro feature panel: MCP Server view)
```

### AWS CLI (if used)

```bash
# Configure AWS credentials
aws configure

# Verify credentials
aws sts get-caller-identity
```

## Dependencies

- **uv/uvx**: Python package manager and runner for MCP servers
- **AWS credentials**: Required for IAM operations (configured via AWS CLI or environment variables)

## Development Setup

1. Install uv: Follow https://docs.astral.sh/uv/getting-started/installation/
2. Configure AWS credentials with appropriate IAM permissions
3. MCP servers will auto-download on first use via uvx
