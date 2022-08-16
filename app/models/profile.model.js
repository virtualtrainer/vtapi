const mongoose = require('mongoose');

const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema({
    firstname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    profilesrc: {
        type: String,
        required: false,
    },
    id: {
        type: String,
        required: false
    },
    gender: { 
        type: String,
        required: false
    },
    city: {
        type: String,
    },
    state: {
        type: String,    
    },
    country: {
        type: String,
    },
    skill : {
        type: String,
        default: ''
    },
    social: [
        
    ],
    walletAddress: [],
    hackathons: [],
    join_as: []
})
);

module.exports = Profile;
