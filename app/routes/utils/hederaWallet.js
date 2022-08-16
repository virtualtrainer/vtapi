const { hederaClient } = require('../utils/hederaClient');
const {} = require('dotenv/config') 

// const { createRequire } = require('module');
// const requires = createRequire(import.meta.url);
const { PrivateKey, AccountCreateTransaction, Hbar } = require("@hashgraph/sdk");

function generatePrivateKey() {
    const privateKey = PrivateKey.generate();
    return privateKey;
}

async function createWallet(privateKey) {
    const client = hederaClient(); //connects to the hederaClient
    //Creates the wallet using the given privateKey
    const accountCreateTx = await new AccountCreateTransaction()
        .setKey(privateKey)
        .setInitialBalance(new Hbar(process.env.INITIAL_BALANCE))
        .execute(client);
    const accountCreateReceipt = await accountCreateTx.getReceipt(client);
    const newAccountId = accountCreateReceipt.accountId;
    return newAccountId;
}

module.exports = { generatePrivateKey, createWallet };