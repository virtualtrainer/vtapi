const { User } = require('../models/user');
const authJwt = require('../middleware/auth')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createWallet, generatePrivateKey } = require('../routers/utils/hederaWallet');
const JWT_SECRET = process.env.secret;
var cors = require('cors');
router.use(cors()); 


/**
 * @route   GET api/auth/user
* @desc    Get user data
* @access  Private
*/

router.get('/', authJwt, async (req, res) => {
 try {
   const user = await User.findById(req.user.id).select('-passwordHash');
   if (!user) throw Error('User does not exist');
   res.json(user);
 } catch (e) {
   res.status(400).json({ msg: e.message });
 }
});

router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})

router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id', authJwt, async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

/**
 * @route   POST api/v1/users/login
 * @desc    Login user
 * @access  Public
 */

 router.post('/login', async (req, res) => {
    const { email, userpassword } = req.body;
  
    // Simple validation
    if (!email || !userpassword) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    try {
      // Check for existing user
      const user = await User.findOne({ email });
      if (!user) throw Error('User does not exist');
  
      const isMatch = await bcrypt.compare(userpassword, user.passwordHash);
      if (!isMatch) throw Error('Invalid credentials');
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
      if (!token) throw Error('Couldnt sign the token');
  
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          walletAddress: {
            id: user.walletAddress.id
          }
        }
      });
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });

/**
 * @route   POST api/v1/users/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  const { name, email, userpassword } = req.body;

  // Simple validation
  if (!name || !email || !userpassword ) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(userpassword, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
        name,
        email,
        passwordHash: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   POST api/v1/users/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register_participant', async (req, res) => {
  const { firstname, lastname, gender, phone, role, city, country, skill, social, ethereumAdd, username, userpassword, hackathons, join_as } = req.body;

  // Simple validation
  if (!username || !email || !userpassword ) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user_name = await User.findOne({ username });
    if (user_name) throw Error('Username already taken');

    const user = await User.findOne({ email });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(userpassword, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
        firstname,
        lastname,
        gender,
        phone,
        email,
        role,
        city,
        country,
        skill, 
        social,
        ethereumAdd,
        username,
        passwordHash: hash,
        hackathons,
        join_as
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

/**
 * @route   POST api/v1/users/wallet
 * @desc    Creates the hedera wallet for the user
 * @access  Private
 */

router.post('/wallet', authJwt, async (req, res) => {

    const privateKey = generatePrivateKey()
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

/**
* @route   PUT api/v1/users/wallet/:id
* @desc    Updates user wallet info
* @access  Private
*/

router.put('/wallet/:id', authJwt, async (req, res) => {

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


router.get(`/get/count`, async (req, res) =>{
    User.countDocuments({}, function (err, count) {
        console.log('there are %d Users Registered', count);
        if(!count) {
            res.status(500).json({success: false})
        } 
        res.send({
            count: count
      });
    });
})

module.exports =router;