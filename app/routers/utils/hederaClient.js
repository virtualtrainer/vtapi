const {} = require('dotenv/config') 

// const { createRequire } = require('module');
// const require = createRequire(import.meta.url);
const { Client, Hbar } = require("@hashgraph/sdk");

function checkProvided(environmentVariable) {
   if (environmentVariable === null) {
     return false;
   }
   if (typeof environmentVariable === "undefined") {
     return false;
   }
   return true;
 }
 
  function hederaClient() {
   const operatorPrivateKey = process.env.PRIVATE_KEY;
   const operatorAccount = process.env.ACCOUNT_ID;
 
   if (!checkProvided(operatorPrivateKey) || !checkProvided(operatorAccount)) {
     throw new Error(
       "environment variables ACCOUNT_KEY and ACCOUNT_ID must be present"
     );
   }
   return hederaClientLocal(operatorAccount, operatorPrivateKey);
 }
 
 function hederaClientLocal(operatorAccount, operatorPrivateKey) {
   if (!checkProvided(process.env.NETWORK)) {
     throw new Error("NETWORK must be set in environment");
   }
 
   let client;
   switch (process.env.NETWORK.toUpperCase()) {
     case "TESTNET":
       client = Client.forTestnet();
       break;
     case "MAINNET":
       client = Client.forMainnet();
       break;
     default:
       throw new Error('NETWORK must be "testnet" or "mainnet"');
   }
   client.setOperator(operatorAccount, operatorPrivateKey);
   if ((typeof(process.env.MAX_TX_FEE) !== undefined) && (process.env.MAX_TX_FEE !== "")) {
     client.setMaxTransactionFee(new Hbar(process.env.MAX_TX_FEE));
   }
   if ((typeof(process.env.MAX_QUERY_PAYMENT) !== undefined) && (process.env.MAX_QUERY_PAYMENT !== "")) {
     client.setMaxQueryPayment(new Hbar(process.env.MAX_QUERY_PAYMENT));
   }
   return client;
 }

 module.exports = { hederaClient };