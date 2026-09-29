# MCP Protocol Proof

A small open-source CLI for developers who need to prove that a **Streamable HTTP MCP endpoint** negotiates at least a required protocol version and exposes the tools they expect.

It was created during the Amazon Developer Hackathon 2026 after a real verification gap: a self-hosted Alexa+ MCP submission must meet a minimum MCP protocol version, but a README claim is not enough. This tool performs a real client handshake and emits a machine-readable receipt.

## What it checks

- connects with the official MCP client over Streamable HTTP;
- reports the negotiated protocol version and protocol era;
- compares the negotiated version with a minimum date;
- lists the actual tools exposed by the server;
- optionally fails if required tool names are missing;
- exits non-zero when the proof fails.

The default minimum is `2025-11-25`, matching the Alexa+ hackathon minimum at the time this project was created. You can override it for any other use case.

## Install

```bash
npm install
```

## Usage

```bash
node ./bin/mcp-protocol-proof.mjs https://example.com/mcp
```

Require a specific minimum:

```bash
node ./bin/mcp-protocol-proof.mjs https://example.com/mcp --min 2025-11-25
```

Require expected tools:

```bash
node ./bin/mcp-protocol-proof.mjs https://example.com/mcp \
  --expect-tool analyze_opportunity \
  --expect-tool next_best_action
```

A passing run returns JSON similar to:

```json
{
  "minimumProtocol": "2025-11-25",
  "protocolVersion": "2026-07-28",
  "protocolEra": "modern",
  "versionPass": true,
  "toolCount": 7,
  "missingTools": [],
  "pass": true
}
```

## Why this matters

MCP integrations are often judged or reviewed from source code and documentation, but compatibility is a runtime property. A real initialize handshake is stronger evidence than a version string copied into a README.

This CLI is intentionally narrow: it does not benchmark a server, inspect private prompts, or make arbitrary tool calls. It proves protocol negotiation and tool discovery only.

## Tests

```bash
npm test
```

## License

MIT
