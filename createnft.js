//Create the NFT
let nftCreate = await new TokenCreateTransaction()
	.setTokenName("diploma")
	.setTokenSymbol("GRAD")
	.setTokenType(TokenType.NonFungibleUnique)
	.setDecimals(0)
	.setInitialSupply(0)
	.setTreasuryAccountId(treasuryId)
	.setSupplyType(TokenSupplyType.Finite)
	.setMaxSupply(250)
	.setSupplyKey(supplyKey)
	.freezeWith(client);

//Sign the transaction with the treasury key
let nftCreateTxSign = await nftCreate.sign(treasuryKey);

//Submit the transaction to a Hedera network
let nftCreateSubmit = await nftCreateTxSign.execute(client);

//Get the transaction receipt
let nftCreateRx = await nftCreateSubmit.getReceipt(client);

//Get the token ID
let tokenId = nftCreateRx.tokenId;

//Log the token ID
console.log(`- Created NFT with Token ID: ${tokenId} \n`);

//IPFS content identifiers for which we will create a NFT
CID = ['QmTzWcVfk88JRqjTpVwHzBeULRTNzHY7mnBSG42CpwHmPa'];

// Mint new NFT
let mintTx = await new TokenMintTransaction()
	.setTokenId(tokenId)
	.setMetadata([Buffer.from('QmTzWcVfk88JRqjTpVwHzBeULRTNzHY7mnBSG42CpwHmPa')])
	.freezeWith(client);

//Sign the transaction with the supply key
let mintTxSign = await mintTx.sign(supplyKey);

//Submit the transaction to a Hedera network
let mintTxSubmit = await mintTxSign.execute(client);

//Get the transaction receipt
let mintRx = await mintTxSubmit.getReceipt(client);

//Log the serial number
console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
