const { hederaClient } = require('../utils/hederaClient');
const {} = require('dotenv/config') 

// const { createRequire } = require('module');
// const requires = createRequire(import.meta.url);
const { PrivateKey, TokenCreateTransaction, TokenAssociateTransaction, TokenMintTransaction, TokenType, TokenSupplyType } = require("@hashgraph/sdk");

//Create Th.0 Token
async function createToken(tokenName, tokenSymbol, decimals, initialSupply, creatorId, freeze) {
    const client = hederaClient();

    //Create the Token
    let createTokenTx = await new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(creatorId)
        .setFreezeDefault(freeze)
        .execute(client);

    //Get the Receipt from the Token transaction
    let createReceipt = await createTokenTx.getReceipt(client);

    //Get the tokenId
    let tokenId = createReceipt.tokenId 

    //Return the TokenId
    return tokenId;
}

//Create Th.0 NFTs
async function createNFTToken(nftName, nftSymbol, supplyKey) {
    const client = hederaClient();

    //Create the NFT
    let nftCreateTx = await new TokenCreateTransaction()
        .setTokenName(nftName)
        .setTokenSymbol(nftSymbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(process.env.TREASURY_ID)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(250)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreateTx.sign(PrivateKey.fromString(process.env.TREASURY_PVKEY));

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let nftId = nftCreateRx.tokenId;

    //return the token ID
    return nftId;
}

async function mintNFTToken(tokenId, supplyKey) {
    const client = hederaClient();
    //IPFS content identifiers for which we will create a NFT
    const cid = await storeFiles();
    
	// Mint new NFT
	let mintTx = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata([Buffer.from(cid)])
		.freezeWith(client);

	//Sign the transaction with the supply key
	let mintTxSign = await mintTx.sign(supplyKey);

	//Submit the transaction to a Hedera network
	let mintTxSubmit = await mintTxSign.execute(client);

	//Get the transaction receipt
	let mintRx = await mintTxSubmit.getReceipt(client);

	//return the serial number
    return mintRx.serials[0].low;	
}

// Associate the token with the wallet to start using it - string walletId. 
async function associateTokenWallet(userId, userKey, token) {
    const client = hederaClient();
    
    //associate the token with the wallet - Permission
    let associateTokenTx = await new TokenAssociateTransaction()
        .setAccountId(userId)
        .setTokenIds([token])
        .freezeWith(client)
        .sign(userKey);
    
    let associateTokenSubmit = await associateTokenTx.execute(client);
        
    //Get the transaction Receipt
    let associateTokenRx = await associateTokenSubmit.getReceipt(client);

    //return the receipt
    return associateTokenRx.status;
}

module.exports = { createToken, createNFTToken, mintNFTToken, associateTokenWallet };