import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const root = process.cwd();
const contractPaths = [
  path.join(root, 'contracts', 'BotsTurnArena.sol'),
  path.join(root, 'contracts', 'BotsTurnArenaDeposit.sol'),
];

const sources = {};
for (const p of contractPaths) {
  sources[path.basename(p)] = { content: fs.readFileSync(p, 'utf8') };
}

function findImport(importPath) {
  // Resolve via node_modules (openzeppelin)
  try {
    const resolved = require.resolve(importPath, { paths: [root] });
    return { contents: fs.readFileSync(resolved, 'utf8') };
  } catch (e) {
    // Also allow relative imports from contracts folder
    const rel = path.join(path.dirname(contractPaths[0]), importPath);
    if (fs.existsSync(rel)) return { contents: fs.readFileSync(rel, 'utf8') };
    return { error: 'File not found: ' + importPath };
  }
}

const input = {
  language: 'Solidity',
  sources,
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

function writeAbi(contractFile, contractName, outFile) {
  const c = output.contracts[contractFile][contractName];
  const abi = c.abi;
  const bytecode = '0x' + c.evm.bytecode.object;
  fs.writeFileSync(
    path.join(root, 'src', 'app', 'abi', outFile),
    `export const ABI = ${JSON.stringify(abi, null, 2)} as const;\nexport const BYTECODE = ${JSON.stringify(bytecode)} as const;\n`
  );
}

fs.mkdirSync(path.join(root, 'src', 'app', 'abi'), { recursive: true });
writeAbi('BotsTurnArena.sol', 'BotsTurnArena', 'arena.ts');
writeAbi('BotsTurnArenaDeposit.sol', 'BotsTurnArenaDeposit', 'arena_deposit.ts');

console.log('Wrote src/app/abi/arena.ts and arena_deposit.ts');
