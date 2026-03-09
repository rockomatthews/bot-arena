import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const root = process.cwd();
const contractPath = path.join(root, 'contracts', 'BotsTurnArena.sol');
const source = fs.readFileSync(contractPath, 'utf8');

function findImport(importPath) {
  // Resolve via node_modules (openzeppelin)
  try {
    const resolved = require.resolve(importPath, { paths: [root] });
    return { contents: fs.readFileSync(resolved, 'utf8') };
  } catch (e) {
    // Also allow relative imports from contracts folder
    const rel = path.join(path.dirname(contractPath), importPath);
    if (fs.existsSync(rel)) return { contents: fs.readFileSync(rel, 'utf8') };
    return { error: 'File not found: ' + importPath };
  }
}

const input = {
  language: 'Solidity',
  sources: {
    'BotsTurnArena.sol': { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImport }));
if (output.errors?.length) {
  const fatal = output.errors.filter((e) => e.severity === 'error');
  for (const e of output.errors) console.error(e.formattedMessage);
  if (fatal.length) process.exit(1);
}

const c = output.contracts['BotsTurnArena.sol']['BotsTurnArena'];
const abi = c.abi;
const bytecode = '0x' + c.evm.bytecode.object;

fs.mkdirSync(path.join(root, 'src', 'app', 'abi'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'src', 'app', 'abi', 'arena.ts'),
  `export const ARENA_ABI = ${JSON.stringify(abi, null, 2)} as const;\nexport const ARENA_BYTECODE = ${JSON.stringify(bytecode)} as const;\n`
);

console.log('Wrote src/app/abi/arena.ts');
