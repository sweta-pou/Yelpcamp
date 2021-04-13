var mongoose = require("mongoose");
const Comment = require("./comment");
var campSchema = new mongoose.Schema({
    name:String,
    image:String,
    price:String,
    location:String,
    lat:Number,
    lng:Number,
    description:String,
    secreteKey:String,
    publicKey:String,
    Owner_name:String,
    Owner_email:String,
    Owner_contact:Number,
    payment:{type:Boolean,default:false},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        createrName:String
    },
    comments:[
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Comment"
       }
    ]
});

campSchema.pre("remove",async function(){
    await Comment.deleteMany({
       _id:{
          $in:this.comments
       }
    });
 }); 
var camp = mongoose.model("camps",campSchema);

module.exports = camp;