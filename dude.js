console.clear();

import fetch from "node-fetch";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { NFTStorage, File } from "nft.storage";
import fs from "fs";

require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	TokenMintTransaction,
} = require("@hashgraph/sdk");

// Configure NFT Storage client
const apiKey = process.env.NFT_ST_API_KEY;
const nftClient = new NFTStorage({ token: apiKey });

// Configure Hedera accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
	// CREATE NFT WITH CUSTOM FEE
	let nftCreate = await new TokenCreateTransaction()
		.setTokenName("myToken")
		.setTokenSymbol("NFT🚀")
		.setTokenType(TokenType.NonFungibleUnique)
		.setSupplyType(TokenSupplyType.Infinite)
		.setDecimals(0)
		.setInitialSupply(0)
		.setTreasuryAccountId(operatorId)
		.setAdminKey(operatorKey)
		.setSupplyKey(operatorKey)
		.setTokenMemo("my Non-fungible token using NFT Storage.")
		.freezeWith(client);

	let nftCreateSubmit = await nftCreate.execute(client);
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);
	let nftCreateRec = await nftCreateSubmit.getRecord(client);
	let tokenId = nftCreateRx.tokenId;
	console.log(`- Created NFT with Token ID: ${tokenId}`);
	console.log(`- Fees ${nftCreateRec.transactionFee._valueInTinybar.c[0] * 1e-8} \n`);

	// NFT STORAGE
	const fileName = "LEAF1.jpg";
	const metadata = await nftClient.store({
		name: "LEAF1",
		description: "Leaf NFT.",
		image: new File([await fs.promises.readFile(fileName)], fileName, { type: "image/jpg" }),
	});

	// IPFS URI FOR NFT METADATA - See HIP-412: https://hips.hedera.com/hip/hip-412
	let ipfsBaseUrl = "https://ipfs.io/ipfs/";
	let ipfsUriMeta = ipfsBaseUrl + metadata.ipnft + "/metadata.json";
	console.log(`- IPFS URI for metadata: ${ipfsUriMeta} \n`);

	// IPFS URI FOR NFT IMAGE
	let response = await fetch(ipfsUriMeta);
	let info = await response.json();
	let ipfsImageInfo = info.image;
	let ipfsImageCid = ipfsImageInfo.match(new RegExp("//" + "(.*)" + "/"));
	let ipfsImageUri = ipfsBaseUrl + ipfsImageCid[1] + "/" + fileName;
	console.log(`- IPFS URI for Image: ${ipfsImageUri} \n`);

	// MINT NEW BATCH OF NFTs
	let mintTx = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata([Buffer.from(metadata.url)])
		.freezeWith(client);
	let mintTxSign = await mintTx.sign(operatorKey);
	let mintTxSubmit = await mintTxSign.execute(client);
	let mintRx = await mintTxSubmit.getReceipt(client);
	let mintRec = await mintTxSubmit.getRecord(client);
	console.log(`- Serial number: ${mintRx.serials[0].low}`);
	console.log(`- Fees ${mintRec.transactionFee._valueInTinybar.c[0] * 1e-8} \n`);
	let totalFees =
		(nftCreateRec.transactionFee._valueInTinybar.c[0] +
			mintRec.transactionFee._valueInTinybar.c[0]) *
		1e-8;
	console.log(`- TOTAL FEES: ${totalFees}`);

	// MIRROR QUERIES
	var url1 = "https://testnet.mirrornode.hedera.com/api/v1/tokens/" + tokenId + "\n";
	console.log(`${url1}`);

	var url2 = "https://testnet.mirrornode.hedera.com/api/v1/tokens/" + tokenId + "/nfts/1";
	console.log(`${url2}`);
}

main();