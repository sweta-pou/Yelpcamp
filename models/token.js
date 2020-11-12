var mongoose = require("mongoose");
var TokenSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
token: { type: String, required: true },
createdAt: { type: Date, required: true,expires: 120, default: Date.now,  }

});
// TokenSchema.index({createdAt: 1},{expireAfterSeconds:120});
var token = mongoose.model("Token",TokenSchema);
module.exports = token;