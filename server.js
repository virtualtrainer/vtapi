const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const { createWallet, generatePrivateKey } = require('./app/routes/utils/hederaWallet');
 
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
// var express = require("express"), 
router = express.Router();

smtpTransport = require('nodemailer-smtp-transport');
//setup nodemailer
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport(smtpTransport({    
     service: 'gmail',
     host: 'smtp.gmail.com',
     port: 465, 
     auth: {        
          user: 'ju3tin95@gmail.com',        
          pass: 'Grierson1979.'    
     },
     tls: {
         rejectUnauthorized: false
     }
}));
//get route to send mail, from form
app.post("/send-mail", function(req,res){
     var to = req.body.to,
         subject = req.body.subject, 
         message = req.body.message;
     //options
     const mailOptions = {
          from: 'ju3tin95@gmail.com',
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
     res.json({ message: "message sent" });
});


app.post("/test12a", function (req,res){
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ju3tin95@gmail.com',
      pass: 'Grierson1979.',
    },
  });
  
  let mailOptions = {
    from: 'ju3tin95@gmail.com',
    to: 'ju3tin@hotmail.co.uk',
    subject: `The subject goes here`,
    html: `The body of the email goes here in HTML`,
  };
  
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });
})

db.mongoose
  .connect(process.env.MONGO3, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


  
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Virtual Trainer Platform" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

//changed line 48 to 51
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//changed the lines above

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
