import {Client, StreamableHTTPClientTransport} from '@modelcontextprotocol/client';

export const DEFAULT_MIN_PROTOCOL='2025-11-25';

export function normalizeEndpoint(input) {
  const url=new URL(input);
  if (!['http:','https:'].includes(url.protocol)) {
    throw new Error('Endpoint must use http or https.');
  }
  return url;
}

export function compareProtocolVersions(actual,minimum) {
  const date=/^\d{4}-\d{2}-\d{2}$/;
  if (!date.test(actual) || !date.test(minimum)) {
    throw new Error('Protocol versions must use YYYY-MM-DD format.');
  }
  return actual.localeCompare(minimum);
}

export async function checkMcpEndpoint(endpoint,{minimum=DEFAULT_MIN_PROTOCOL,expectedTools=[]}={}) {
  const url=normalizeEndpoint(endpoint);
  const client=new Client(
    {name:'mcp-protocol-proof',version:'0.1.0'},
    {versionNegotiation:{mode:'auto'}}
  );
  const transport=new StreamableHTTPClientTransport(url);

  try {
    await client.connect(transport);
    const listed=await client.listTools();
    const protocolVersion=client.getNegotiatedProtocolVersion?.() ?? 'unknown';
    const protocolEra=client.getProtocolEra?.() ?? 'unknown';
    const tools=listed.tools.map((tool)=>tool.name).sort();
    const missingTools=expectedTools.filter((name)=>!tools.includes(name));
    const versionPass=protocolVersion!=='unknown'
      && compareProtocolVersions(protocolVersion,minimum)>=0;

    return {
      endpoint:url.toString(),
      minimumProtocol:minimum,
      protocolVersion,
      protocolEra,
      versionPass,
      toolCount:tools.length,
      tools,
      missingTools,
      pass:versionPass && missingTools.length===0
    };
  } finally {
    await client.close();
  }
}
