console.clear();
require("dotenv").config();
const {
	Client,
	TokenCreateTransaction,
} = require("@hashgraph/sdk");

const operatorId = process.env.OPERATOR_ID;
const operatorKey = process.env.OPERATOR_PVKEY;
const treasuryAccountId = process.env.TREASURY_ID;
const treasuryKey = process.env.TREASURY_PVKEY;
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const adminPublicKey = process.env.adminpublic;


async function main() {
const transaction = await new TokenCreateTransaction()
     .setTokenName("Your Token Name")
     .setTokenSymbol("F")
     .setTreasuryAccountId(treasuryAccountId)
     .setInitialSupply(5000)
     .setAdminKey(adminPublicKey)
     .setMaxTransactionFee() //Change the default max transaction fee
     .freezeWith(client);


//Sign the transaction with the token adminKey and the token treasury account private key
const signTx =  await (await transaction.sign(adminKey)).sign(treasuryKey);

//Sign the transaction with the client operator private key and submit to a Hedera network
const txResponse = await signTx.execute(client);

//Get the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Get the token ID from the receipt
const tokenId = receipt.tokenId;

console.log("The new token ID is " + tokenId);
}
main();
//v2.0.5