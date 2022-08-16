const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.profile = require("./profile.model");

db.ROLES = ["user", "admin", "superadmin", "staff"];

module.exports = db;