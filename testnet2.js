require("dotenv").config();
const {
    AccountId,
	PrivateKey,
	Client,
	TokenNftInfoQuery,
} = require("@hashgraph/sdk");
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
const nftInfos = await new TokenNftInfoQuery().setNftId(process.env.newTokenId).execute(client);
}




    main();
    