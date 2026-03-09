import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { ARENA_ABI, ARENA_BYTECODE } from '../src/app/abi/arena.js';

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error('Missing ' + name);
  return v;
}

const rpcUrl = required('BASE_RPC_URL');
const pk = required('DEPLOYER_PRIVATE_KEY');
const treasury = required('TREASURY_ADDRESS');

const feeBps = BigInt(process.env.FEE_BPS || '100');
const maxBetUsdc = process.env.MAX_BET_USDC || '25';
const maxBet = parseUnits(maxBetUsdc, 6);

const account = privateKeyToAccount(pk);
const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
const walletClient = createWalletClient({ chain: base, transport: http(rpcUrl), account });

const hash = await walletClient.deployContract({
  abi: ARENA_ABI,
  bytecode: ARENA_BYTECODE,
  args: [USDC_BASE, treasury, Number(feeBps), maxBet],
});

console.log('deploy tx:', hash);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log('contractAddress:', receipt.contractAddress);
