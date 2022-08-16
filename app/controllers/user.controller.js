const Profile = require('../models/profile.model');
const User = require('../models/user.model');
//const { hederaClient } = require('../utils/hederaClient');
//const { createWallet, generatePrivateKey } = require('../routers/utils/hederaWallet');
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
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
 
    //console.log(req.userId); // Add to req object
    const query =  req.userId ;
  //res.status(200).send("User Content.");
 // const movie = User.findOne(query);
 //console.log(movie);
 //var dude44 = 'dude@london.com';
 User.findOne({_id: query}, function(err, result) {
  if (err) throw err;
 // console.log(result.email);
 var dude56s = result.email;
 User.aggregate([{ $match: {email: dude56s } },{
  $lookup:
     {
         from: "profiles",
         localField: "profile",
         foreignField: "_id",
         as: "profile"
     }
},{
  $lookup:
   {
       from: "roles",
       localField: "roles",
       foreignField: "_id",
       as: "roles"
   },            
},{
$project:
 {
  _id: 1, 
  email: 1, 
  username: 1, 
  profile: 1,
  confirmed: 1,
  roles:'$roles.name',
 },            
}]).then(result => res.json(result)).catch(err => console.log(err))
});
    
    //res.json(users);
 
  
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.Profile = (req, res) => {
  const message = new Profile({
    phone: req.body.phone,
    city: req.body.city,
    country: req.body.country,
    skill: req.body.skill,
    social: req.body.social,
  });
  message
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message.",
      });
    });
};

exports.profileinfotwo = async (req, res) =>{
  const userid = req.userId;
  const { inputhackathon } = req.body;
  const { inputjoin } = req.body;
  if (!inputhackathon || !inputjoin) {
    return res.status(422).send({ message: "Something went wrong" });
 }else{
  let doc = await Profile.findOneAndUpdate({id: userid},({hackathons: inputhackathon, join_as: inputjoin}));
  return res.status(200).send({ message: "updated list" });
 }

};

exports.profileinfoone = async (req, res) =>{
  const { inputfirstname } = req.body;
  const { inputlastname } = req.body;
  const { inputphone } = req.body;
  const { inputcountry } = req.body;
  const { inputstate } = req.body;
  const { inputcity } = req.body;
  const { inputsocialfacebook } = req.body;
  const { inputsocialtwitter } = req.body;
  const { inputsocialdiscord } = req.body;
  const { inputsocialreddit } = req.body;
  const { inputsocialtelegram } = req.body;
  const { inputsocialinstagram } = req.body;
  const userid = req.userId;
  if (!inputfirstname || !inputlastname) {
    return res.status(422).send({ message: "Something went wrong" });
 }else{
  let doc = await Profile.findOneAndUpdate({id: userid},
    ({firstname: inputfirstname, lastname: inputlastname, phone: inputphone, country: inputcountry, state: inputstate, city: inputcity, 
      social : [{"facebook": inputsocialfacebook, "twitter": inputsocialtwitter, "discord": inputsocialdiscord, "reddit": inputsocialreddit, "telegram": inputsocialtelegram,"instagram": inputsocialinstagram}]}));
 return res.status(200).send({ message: "profile updated" });
 }
};

exports.profileimageurl = async (req, res) =>{
  const { imageurl  } = req.body;
  const userid = req.userId;
  if (!imageurl) {
    return res.status(422).send({ message: "Something went wrong" });
 }else{
  const filter = { profilesrc: imageurl };
  
  let doc = await Profile.findOneAndUpdate({id: userid},filter);
  return res.status(200).send({ message: "Image updated" });
 }
};

exports.profileinfouser = async (req, res) =>{
  const criteria = {};
criteria.$or = [];
  const userid = req.userId;
  let doc = await User.findOneAndUpdate(
    {_id: req.userId, 'profile.id': req.userId}, 
    {$push: { profiles: [{ "firstname":"asdadasdsd" }]}
  }
);
return res.status(200).send({ message: "Image updated" });
};


  exports.editNestedArray = async (req, res) => {
    const arrayId = '61dc8706a8c5700607c958ff';
  
    const { value } = req.body;
  
    const artist = await User.updateOne(
      {
        "profile._id": arrayId,
      },
      {
        $set: {
          "profiles.$firstname": "justin",
        },
      }
    );
  
    if (artist) {
      res.send("Successful");
    } else {
      res.status(500).send("Not successful");
    }
  };


exports.wallet = async (req, res) => {
  // async makes this work
  const privateKey = generatePrivateKey()
 //const privateKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("User Private Key:", privateKey.toString());

  //  const accountID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
  const accountID = await createWallet(privateKey);
    console.log("Address: " + accountID.toString());

    const userWallet = {
        WalletAddress: accountID.toString(),
        PrivateKey: privateKey.toString()
       }
       
    if (!userWallet) return res.status(404).json({success: false , message: "Wallet could not be created!"})
   
    return res.json(userWallet);
 // res.status(200).send("Admin Content.");
};

exports.getUser = async (req, res) => {
  try {
      const userId = req.params.id
      const result = await User.aggregate([
          {
              $match: {
                  "ref_id": userId
              }
          },
          {
              $lookup: {
                  from: "expenses-category",
                  let: { "userRefId": "$ref_id" },
                  pipeline: [
                      {
                          $match: {
                              $expr: { $eq: ["$user_ref_id", "$$userRefId"] }
                          }
                      },
                      {
                          $lookup: {
                              from: "expenses",
                              let: { "categoryRefId": "$ref_id" },
                              pipeline: [
                                  {
                                      $match: {
                                          $expr: { $eq: ["$expenses_category_ref_id", "$$categoryRefId"] }
                                      }
                                  },
                              ],
                              as: "expenses"
                          },
                      },
                  ],
                  as: "expenses_categories"
              }
          },
      ])
      res.json(result[0] || {})
  } catch (error) {        
      res.json({error: error.message})
  }
};

exports.ready1 = async (req, res) => {
  const query =  req.userId ;
        res.status(200).send("{\"accountbalance\": \"1234\", \"accountId\": \"123456\", \"PublicKey\": \"345dsfsdfsdfsdf\", \"PrivateKey\": \"sdfsfsfdsfsdfsdfd\"}");
};

exports.createwallet = async (req, res) => {
  const userid = req.userId;
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.ACCOUNT_ID;
    const myPrivateKey = process.env.PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
       }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generate(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(0))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

   // console.log("The new account ID is: " +newAccountId);
   // console.log("The new account Public Key is: " +newAccountPublicKey);
   // console.log("The new account Private Key is: " +newAccountPrivateKey);
   
    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);
        
   // console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
   // res.status(200).send("{\"accountbalance\": \""+accountBalance.hbars.toTinybars()+"\", \"accountId\": \""+newAccountId+"\", \"PublicKey\": \""+newAccountPublicKey+"\", \"PrivateKey\": \""+newAccountPrivateKey+"\"}");
 
    let doc = await Profile.findOneAndUpdate({id: userid},
      ({walletAddress: [{"accountId": String(newAccountId), "PublicKey": String(newAccountPublicKey)}]}));
   //return res.status(200).send({ message: "profile updated" });
   return res.status(200).send("{\"accountbalance\": \""+accountBalance.hbars.toTinybars()+"\", \"accountId\": \""+newAccountId+"\", \"PublicKey\": \""+newAccountPublicKey+"\", \"PrivateKey\": \""+newAccountPrivateKey+"\"}");
 

};