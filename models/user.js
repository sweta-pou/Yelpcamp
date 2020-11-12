var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var token = require("./token.js");
var userSchema = new mongoose.Schema(
{
    username:String,
    password:String,
    phoneNumber:Number,
    city:String,
    gender:String,
    isverified:{type:Boolean,default:false},
    verificationExpires: {
        type: Date,
        default: () => new Date(+new Date() + 15 * 60 * 1000) //3 minutes
      },
    email:{type:String,unique:true},
    isOwner:{type:Boolean,default:false},
    isAdmin:{type:Boolean,default:false}
}
);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);