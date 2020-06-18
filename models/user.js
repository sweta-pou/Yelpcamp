var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema(
{
    username:String,
    password:String,
    phoneNumber:Number,
    city:String,
    gender:String,
    isOwner:{type:Boolean,default:false},
    isAdmin:{type:Boolean,default:false}
}
);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);