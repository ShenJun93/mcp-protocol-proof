#!/usr/bin/env node
import {checkMcpEndpoint,DEFAULT_MIN_PROTOCOL} from '../src/check.js';

function usage() {
  console.log('Usage: mcp-protocol-proof <mcp-url> [--min YYYY-MM-DD] [--expect-tool NAME ...]');
}

const args=process.argv.slice(2);
if (!args.length || args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(args.length ? 0 : 1);
}

const endpoint=args[0];
let minimum=DEFAULT_MIN_PROTOCOL;
const expectedTools=[];

for (let i=1;i<args.length;i+=1) {
  if (args[i]==='--min') {
    minimum=args[++i];
    if (!minimum) throw new Error('--min requires a value.');
  } else if (args[i]==='--expect-tool') {
    const name=args[++i];
    if (!name) throw new Error('--expect-tool requires a value.');
    expectedTools.push(name);
  } else {
    throw new Error(`Unknown argument: ${args[i]}`);
  }
}

try {
  const result=await checkMcpEndpoint(endpoint,{minimum,expectedTools});
  console.log(JSON.stringify(result,null,2));
  process.exit(result.pass ? 0 : 2);
} catch (error) {
  console.error(JSON.stringify({
    pass:false,
    error:error instanceof Error ? error.message : String(error)
  },null,2));
  process.exit(1);
}
