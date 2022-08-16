const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Profile = db.profile;
var collection = db.profiles;
var async = require('async');
const _ = require("lodash");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user, profile } = require("../models");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    signuprandomnumber: Math.floor(100000 + Math.random() * 900000)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          smtpTransport = require('nodemailer-smtp-transport');
//setup nodemailer
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport(smtpTransport({    
     service: 'thpoint0.io',
     host: 'mail.thpoint0.io',
     port: 465, 
     auth: {        
          user: 'registrations@thpoint0.io',        
          pass: 'guwsez-jAzme1-hastac'    
     },
     tls: {
         rejectUnauthorized: false
     }
}));
//get route to send mail, from form
var tokenObject = {
  email: user.email,
  id: user._id
};
var secret = user._id + '_' + user.email + '_' + new Date().getTime();
var token = jwt.sign(tokenObject, secret);
     var to = user.email,
         subject = 'Email Confirmation', 
         message = 'This is your confirmation code for your account with TH.0 Community <br>'+user.signuprandomnumber+'<br>Click on the<a href="https://th0frontend.herokuapp.com/verify.php?token='+ token +'">Confirmation Link</a><br>and enter the code.';
     //options
     const mailOptions = {
          from: 'registrations@thpoint0.io',
          to: to,                   // from req.body.to
          subject: subject,         //from req.body.subject
          html: message             //from req.body.message
      };
     //delivery
     transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);  
          } else {     
              console.log('Email sent: ' + info.response);  
          }   
     });
     

  
          res.send({ message: "Please check your email for confirmation "/*+user.signuprandomnumber*/});
          
        });
      });
    }
  });
};

exports.dude56 = function (req, res, next){
  User.aggregate([
    {
      $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile"
          }
      }
  ])

};

  exports.dude45 = async (req, res) => {
    try {
      const pipeline = [
        {
          '$lookup' : {
            from: "profiles",
            localField: "profile",
            foreignField: "_id",
            as: "profile"
          }
        }
      ]
  
      const { db } = await connectToDatabase()
      const posts = await db.collection('users').aggregate(pipeline).toArray();
      return res.json({ posts })
    } catch (error) {
      return res.json({ error })
    }
  }; // -> in your example, the closing of the function was missing.

exports.allusers = function (req, res) {
  User.find({}, function(err, users) {
    if(err){
      res.send('something went worng');
      next();
    }
    res.json(users);
  })
};

exports.forgot_password = function (req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create a unique token
       var tokenObject = {
           email: user.email,
           id: user._id
       };
       var secret = user._id + '_' + user.email + '_' + new Date().getTime();
       var token = jwt.sign(tokenObject, secret);
       done(err, user, token);
    },
    function(user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { new: true }).exec(function(err, new_user) {
        done(err, token, new_user);
      });
    },
    function(token, user, done) {
      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: 'http://localhost:3000/auth/reset_password?token=' + token,
          name: user.fullName.split(' ')[0]
        }
      };

      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
};

exports.forgot_password9 = function (req, res) {
const {email} = req.body;
User.findOne({email}, (err, user) =>{
  if(err || !user){
    return res.status(400).json({error: "User with this email does not exists"});
  }else{
    const token = jwt.sign({_id: user._id}, config.secret, {expiresIn: '20min'});
    smtpTransport = require('nodemailer-smtp-transport');
    //setup nodemailer
    const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport(smtpTransport({    
         service: 'thpoint0.io',
         host: 'mail.thpoint0.io',
         port: 465, 
         auth: {        
              user: 'registrations@thpoint0.io',        
              pass: 'guwsez-jAzme1-hastac'    
         },
         tls: {
             rejectUnauthorized: false
         }
    }));
    var to = user.email,
    subject = 'Password Reset', 
    message = `<h2>Please click here on the given link to reset your password</h2>
              <p><a href="https://th0frontend.herokuapp.com/resetpassword.php?token=`+token+`">Reset Link</a></p>`;
//options
const mailOptions = {
     from: 'registrations@thpoint0.io',
     to: to,                   // from req.body.to
     subject: subject,         //from req.body.subject
     html: message             //from req.body.message
 };
//delivery
transporter.sendMail(mailOptions, function(error, info){
     if (error) {
         console.log(error);  
     } else {     
         console.log('Email sent: ' + info.response);  
     }   
});
return user.updateOne({resetLink: token}, function(err, info){
if (err){
  return res.status(400).json({error: "reset password link"})
}else{
  res.send({ message: "Email has been sent, kindly follow instructions"/*+user.signuprandomnumber*/});

}

}

)


  
  }
})
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      if (user.confirmed === false) {
        return res.status(511).send({ 
          accessToken: token,
          message: "Your email has not been confirmed.<button></button> <a href=\"/verifiyemail/"+token+"\">Click here to Activate</a>"});

      }

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.signinaa = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      if (user.confirmed === false) {
        return res.status(511).send({ 
          /*accessToken: token,*/
          message: 'Your email has not been confirmed.', message1: ''+token+''});

      }

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.signup1 = async (req, res) => {
  const { email } = req.body
  // Check we have an email
  if (!email) {
     return res.status(422).send({ message: "Missing email." });
  }
  try{
     // Check if the email is in use
     const existingUser = await User.findOne({ email }).exec();
     if (existingUser) {
        return res.status(409).send({ 
              message: "Email is already in use."
        });
      }
     // Step 1 - Create and save the user
     const user = await new User({
        _id: new mongoose.Types.ObjectId,
        email: email
     }).save();
     // Step 2 - Generate a verification token with the user's ID
     const verificationToken = user.generateVerificationToken();
     // Step 3 - Email the user a unique verification link
     const url = `http://localhost:3000/api/verify/${verificationToken}`
     transporter.sendMail({
       to: email,
       subject: 'Verify Account',
       html: `Click <a href = '${url}'>here</a> to confirm your email.`
     })
     return res.status(201).send({
       message: `Sent a verification email to ${email}`
     });
 } catch(err){
     return res.status(500).send(err);
 }
};

exports.update = (req, res) => {
  const { tokena } = req.body;
  const { idfield } = req.body;
  const decoded = jwt.decode(tokena);
  const json2 = JSON.stringify(decoded);
console.log('tell me = '+json2);
const splitStr = json2.substring(json2.indexOf('"id":') + 6);
 const splitStr2 = splitStr.substring(0, splitStr.indexOf('"'));
 
 //var splitStr17 = json2a.substring(json2a.indexOf('_id\":\"') + 6);
 //var splitStr18 = splitStr7.substring(0, splitStr7.indexOf('"'));
 console.log('email = '+splitStr2);
  if (!idfield) { return res.status(422).send({message: "Missing ID"})};
  if (!tokena) {
    return res.status(422).send({ message: "Missing token." });
 }else{
  User.findOneAndUpdate({_id: splitStr2},{confirmed: true})
 // const id = req.params.id;
 // User.findOneAndUpdate(email, splitStr2, { confirmed: false })
 /*User.findByIdAndUpdate(_id, splitStr18, { useFindAndModify: false })
  
   */ .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" +splitStr2
      });
    });
  }
};

exports.profileimageupdate = (req, res) => {

  Profile.findOneAndUpdate({ "_id": bookId }, 
  { "$set": { "name": name, "genre": genre, "author": author, "similar": similar}}
  ).exec(function(err, book){
    if(err) {
        console.log(err);
        res.status(500).send(err);
    } else {
             res.status(200).send(book);
    }
 });

};

exports.verifiuser = (req, res) => {
  const { tokena } = req.body;
  const { idfield } = req.body;
  
  if (!idfield) { return res.status(422).send({message: "Missing ID"})};
  if (!tokena) {
    return res.status(422).send({ message: "Missing token." });
 }else{
var decoded = jwt.decode(tokena);
var json2 = JSON.stringify(decoded);
//console.log('tell me = '+json2);
 var splitStr = json2.substring(json2.indexOf('"id":"') + 6);
 var splitStr2 = splitStr.substring(0, splitStr.indexOf('"'));
 //console.log('email = '+splitStr2);
 // User.findById(splitStr2, (error, data)=> {
    User.findOne({_id: splitStr2}, (error, data)=> {
    if(error){
      console.log(error);
    }else{
    //  console.log(data);
      var json2a = JSON.stringify(data);
      var splitStra = json2a.substring(json2a.indexOf('signuprandomnumber\":\"') + 21);
      var splitStr5 = splitStra.substring(0, splitStra.indexOf('"'));
      var splitStrb = json2a.substring(json2a.indexOf('confirmed\":\"') + 14);
      var splitStr6 = splitStrb.substring(0, splitStrb.indexOf(','));
      var splitStr7 = json2a.substring(json2a.indexOf('_id\":\"') + 6);
      var splitStr8 = splitStr7.substring(0, splitStr7.indexOf('"'));
      const dude45aaaa = splitStr8;
      var dude34a = false;
     // console.log('splitStr6 = '+splitStr6);
     // console.log('_id = '+splitStr8);
     // console.log('json list'+json2);
     // console.log('json list 2'+decoded);
      var Boolify = require('node-boolify').Boolify;
      if(splitStr5 === idfield) { 
      if (Boolify(splitStr6) == false){
   //     var myobj = { firstname: "Company Inc", country: "Highway 37" };
        var myobj = { name: "Ajeet Kumar", age: "28", address: "Delhi" };  
        const profile = new Profile({
          id: splitStr8
       }).save().then(profile =>{
      //  console.log(profile.id);
        //const response2 = await.fetch.profile;
       // console.log(response2)
        try {
          return User.findOneAndUpdate({_id: profile.id}, { profile: profile._id ,confirmed: true}).exec();
      } catch(err) {
          return err;
      }
        //const user1 = User.findOneAndUpdate({_id: profile.id}, { profile: profile.id ,confirmed: true})
  
       }
       );
       var datawest = data._id;
      // console.log(datawest);
      /* var objectId = Profile.findOne({id: splitStr8}, (error, profile)=> {
        if(error || !profile){console.log("something went wrong")}
        else{
          console.log("its all good");
         // const json2as = JSON.stringify(profile);
        //  console.log(json2as);
        //  var dude34d = "62690c8788834b48c4009de6";
         
        //  var datawest2 = profile._id;
        
     
        //  var dude34d = "62690c8788834b48c4009de6";
        //  User.findOneAndUpdate({ _id: splitStr8 }, { profile: Profile._id }, { new: true });
        }
      
      });*/
      // console.log(objectId);
   //  const json2a5 = JSON.stringify(data);
   //  console.log(json2a5);
    // var dude34d = "62690c8788834b48c4009de6";
        User.findOne({_id: splitStr8})
        
       // const id = req.params.id;
       // User.findOneAndUpdate(email, splitStr2, { confirmed: false })
       /*User.findByIdAndUpdate(_id, splitStr18, { useFindAndModify: false })
        
         */ .then(data => {
            if (!data) {
              res.status(404).send({
                message: "Cannot update. There seems to be a problem with your account"
              });
            } else{ 
              //updates profile as well
              return res.status(200).send({ message: "Success Your Account has been confirmed just login to the TH.0 Community Platform" });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Your Account"
            });
          });
        }else{
      return res.status(200).send({ message: "Your Account has already been confirmed just login to the TH.0 Community Platform"}
      )
      }}else{
        return res.status(401).send({ message: "The Verification Code does Not Match"})
      };
      //return res.status(422).send({ message: ""+ splitStr5+"" });
    }
  }

  )
 }
};

exports.resetPassword = (req, res) => {
  const {resetLink, newPass} = req.body;
  if(resetLink) {
    jwt.verify(resetLink, config.secret, function(err,decodedData){
      if(err){
        return res.status(401).json({
          error: "Incorrect token or it has expired."
        })
      }
      var decodedreset = jwt.decode(resetLink);
      var json21 = JSON.stringify(decodedreset);
      var userid = decodedreset[0];
     // console.log('tell me = '+json21);
      var splitStra = json21.substring(json21.indexOf('"_id":"') + 7);
      var splitStr21 = splitStra.substring(0, splitStra.indexOf('"'));
     // console.log(splitStr21);
      User.findById({ _id: splitStr21 }, (err, user)=>{
        if(err || !user) {
          return res.status(400).json({error: "User with this token does not exist"});
        }
        var resetlinkk2 = user.resetLink;
        if(resetlinkk2.length === 0){
          return res.status(401).json({
            error: "Incorrect token or it has expired."
          })
        } 
        const obj = {
          password: bcrypt.hashSync(newPass, 8),
          resetLink: ''
        }
        //console.log('trying new');
        user = _.extend(user, obj);
        user.save((err, result) =>{
          if(err){
          return res.status(400).json({error: "reset password error"});
          }else{
           return res.status(200).json({message: "Your password has been changed"});
          }
        })
      })
    })
  }else{
    return res.status(401).json({
      error: "Authenticaton error!!!"
    })
  }
};