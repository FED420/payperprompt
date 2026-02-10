
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Stacks = require('@stacks/transactions');

const privateKey = Stacks.makeRandomPrivKey();

try {
    // Use 'testnet' string as the network argument
    const address = Stacks.getAddressFromPrivateKey(privateKey, 'testnet');

    console.log('--- NEW STACKS TESTNET WALLET ---');
    console.log(`Private Key: ${privateKey}`);
    console.log(`Address:     ${address}`);
    console.log('---------------------------------');
    console.log('Please fund this address using the Stacks Explorer Sandbox Faucet:');
    console.log(`https://explorer.hiro.so/sandbox/faucet?chain=testnet&address=${address}`);

} catch (e) {
    console.error("Error generating address:", e);
    console.log("Docs: https://stacks.js.org/");
}
