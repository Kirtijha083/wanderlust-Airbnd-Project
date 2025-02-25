const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//definig schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    // or baki username and password by default save ho hi jyega isme through.........passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose); //isko isly use kiye qki yahi automatically password, username, hashing, salting kr deta h khud se

module.exports = mongoose.model('User', userSchema);