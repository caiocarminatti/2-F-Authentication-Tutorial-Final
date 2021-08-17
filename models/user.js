//Import mongoose
const mongoose = require('mongoose');

//Import passport-local-mongoose to add authentication features
const plm = require('passport-local-mongoose');

//Create a schema definition object for the Users collection
const schemaDefinition = {
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    verificationCode: {
        type: String,
        default: "QZ9DKRL43KHJFW031WWB*"
    },
    verificationAttempts: {
        type: Number,
        default: 0
    },
    verificationStatus: {
        type: Boolean,
        default: false
    },
    oauthId: {
        type: String
    },
    oauthProvider: {
        type: String
    },
    created: {
        type: Date
    }
}

//Create a new mongoose schema with the definition object
var usersSchema = new mongoose.Schema(schemaDefinition);

//Add Passport auth to the model
usersSchema.plugin(plm);

//Export thenew mongoose model
module.exports = mongoose.model('User', usersSchema);