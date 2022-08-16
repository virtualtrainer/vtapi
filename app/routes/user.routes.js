const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const { createWallet, generatePrivateKey, getBalance } = require('../routers/utils/hederaWallet');
const { createToken, createNFTToken, mintNFTToken, associateTokenWallet } = require('../routers/utils/hederaToken')
const { PrivateKey,TokenSupplyType, TokenType,TokenMintTransaction, AccountCreateTransaction, CustomFixedFee, CustomRoyaltyFee, AccountBalanceQuery, TokenCreateTransaction} = require("@hashgraph/sdk");
 require("dotenv").config();
const { Client, Hbar } = require("@hashgraph/sdk");
const client = Client.forTestnet();
const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = process.env.PRIVATE_KEY;
const treasuryId = process.env.TREASURY_ID;
const treasuryKey = process.env.TREASURY_PVKEY;
const operatorId = process.env.OPERATOR_ID;
const operatorKey = process.env.OPERATOR_PVKEY;



module.exports = function(app) {
app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

app.get(
  "/api/test/all", 
  controller.allAccess
  );

app.get(
  "/api/test/user", 
  [authJwt.verifyToken], 
  controller.userBoard
  );

app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

app.get("/api/allusers", 
[authJwt.verifyToken, authJwt.isAdmin],
controller.allAccess
);

app.post("/api/testnet", async(req, res) =>{
    return res.send('hi');
  });


  app.post(
    "/api/profileimageurl",
  [authJwt.verifyToken], 
  controller.profileimageurl
  );
  app.post(
    "/api/profileupdateone",
  [authJwt.verifyToken], 
  controller.profileinfoone
  );

  app.post(
    "/api/profileupdatetwo",
  [authJwt.verifyToken], 
  controller.profileinfotwo
  );

app.post(
    "/api/test/wallet",
    //[authJwt.verifyToken, authJwt.isAdmin],
    controller.wallet
  );

app.post(
  "/api/ready1",
  [authJwt.verifyToken],
  controller.ready1
);

app.post(
  "/api/createnewwallet",
[authJwt.verifyToken],
controller.createwallet
);

app.post(
    "/api/profile",
    //[authJwt.verifyToken, authJwt.isAdmin],
    controller.Profile
  );

app.get("/api/cid", async(req, res) =>{
  var request = require("request");

var options = { method: 'GET',
  url: 'https://api.nft.storage/',
  headers: 
   { 'cache-control': 'no-cache',
     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhMTI2NTUyYUQyNTAwZWQxNzYzNWRFNTZiOUY0QkQ2QzE2MzY3ZjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDUxMDcwNzE4NywibmFtZSI6InVwZGF0ZSJ9.btmDHywyGkJivySgWuHciTqfiCa0peV-ikWBX-EdV2s',
     accept: 'application/json' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

 // console.log(body);
  return res.send(body);
});

}
);

 app.post('/create-wallet',  async (req, res) => {

  const privateKey = generatePrivateKey();
  console.log("User Private Key:", privateKey.toString());

  const accountID = await createWallet(privateKey);
  console.log("Address: " + accountID.toString());

  const userWallet = {
      WalletAddress: accountID.toString(),
      PrivateKey: privateKey.toString(),
      PublicKey: privateKey.publicKey.toString()
     }
     
  if (!userWallet) return res.status(404).json({success: false , message: "Wallet could not be created!"})
  return res.json(userWallet)
 })

app.post('/createToken',  async (req, res) => {
  
  const { tokenName, tokenSymbol, decimals, initialSupply } = req.body;
  const creatorId = process.env.ACCOUNT_ID;
  const tokenId = await createToken(tokenName, tokenSymbol, decimals, initialSupply, creatorId);

  // TODO: return the company initail token supply
  const companyToken = {
      tokenID: tokenId.toString()
     }
     
  if (!companyToken) return res.status(404).json({success: false , message: "Token is not created!"})
  return res.json(companyToken)
 })

app.post('/get-balance',  async (req, res) => {
  
  const { accountId, tokenId } = req.body;
   
  const ubalance = getBalance(accountId, tokenId)

  const userBalance = {
      Balance: ubalance.toString()
     }
     
  if (!userBalance) return res.status(404).json({success: false , message: "Balance is not available!"})
  return res.json(userBalance)
 })

app.post('/transfer-token',  async (req, res) => {

  const { transferFrom, transferTo, token, amount  } = req.body;

  const transf = await transferToken(transferFrom, transferTo, token, amount);
  
  const tranzak = {
    Receipt: transf.toString()
   }
   
if (!tranzak) return res.status(404).json({success: false , message: "Transfer Not Sucessfully Complete !"})
return res.json(tranzak)
})

app.post('/createNFT',  async (req, res) => {

const { nftName, nftSymbol, supplyKey  } = req.body;

const nFT = await createNFTToken(nftName, nftSymbol, supplyKey);

const createdNFT = {
  NFT: nFT.toString()
 }
 
if (!createdNFT) return res.status(404).json({success: false , message: "NFT not created!"})
return res.json(createdNFT)
})

app.post('/mintNFT',  async (req, res) => {

const { tokenId, supplyKey  } = req.body;

const nFTmint = await mintNFTToken(tokenId, supplyKey);

const mintedNFT = {
  MintedNFT: nFTmint.toString()
 }
 
if (!mintedNFT) return res.status(404).json({success: false , message: "NFT unable to mint!"})
return res.json(mintedNFT)
})

app.put('/wallet/:id',  async (req, res) => {

  const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        walletAddress: {
              id: req.params.accountID.toString,
              pubKey: req.params.privateKey.publicKey.toString()
        }
      },
      { new: true}
  );

  if(!user)
  return res.status(400).send('the user cannot be created!')
  res.send(user);
})

app.post(
    "/api/dude",
    //[authJwt.verifyToken, authJwt.isAdmin], 
    controller.getUser
  );
app.post('/api/tester1', async(req, res) =>{

  const supplyKey = PrivateKey.generate();
  const adminKey = PrivateKey.generate();
  const pauseKey = PrivateKey.generate();
  const freezeKey = PrivateKey.generate();
  const wipeKey = PrivateKey.generate();

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

//set


  //const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  
    CID = [
      "QmNPCiNA3Dsu3K5FxDPMG5Q3fZRwVTg14EXA92uqEeSRXn"
    ];
 
// Mint new NFT
let mintTx = await new TokenMintTransaction()
	.setTokenId(tokenId)
	.setMetadata([Buffer.from(CID)])
	.freezeWith(client);

//Sign the transaction with the supply key
let mintTxSign = await mintTx.sign(supplyKey);

//Submit the transaction to a Hedera network
let mintTxSubmit = await mintTxSign.execute(client);

//Get the transaction receipt
let mintRx = await mintTxSubmit.getReceipt(client);

//Log the serial number
console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);


  return res.send('dude')
});
app.post('/api/createth0nft', async(req, res) =>{
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
.setSupplyKey(1)
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

});

};

