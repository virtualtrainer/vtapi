const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const User = require("../models/user.model");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/get/count", async (req, res) =>{
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

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    "/api/auth/signup1",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup1
  );

  app.post(
    "/api/auth/verifiuser",
    controller.verifiuser
  );

  app.get(
    '/allusers', (req, res) => {
    User.aggregate([ {
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
      _id: 0, 
      email: 1, 
      username: 1, 
      profile: 1,
      confirmed: 1,
      roles:'$roles.name',
     },            
 }]).then(result => res.json(result)).catch(err => console.log(err))
}
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signinaa", controller.signinaa);

  app.get("/api/alluserslist", controller.allusers);

  app.get("api/123", controller.dude56);

  app.put("/api/forgotpassword", controller.forgot_password9);

  app.put("/api/restpassword", controller.resetPassword);
};
