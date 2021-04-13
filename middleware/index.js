var comment= require("../models/comment");
const passport = require("passport");
const user = require("../models/user"),
    camp   = require("../models/camp");
 
     
var middleWare = {}

middleWare.CommentUserCheck= function(req,res,next)
{
    if(req.isAuthenticated())
    {    comment.findById(req.params.comment_id,function(err,foundComment)
        {
            if(foundComment.author.id.equals(req.user._id))
            {
                return next();
            }
          else{
              res.send("invalid authorization");
              console.log("user not matched");
              }
        }
        )  
        
    }
    else{res.redirect("back");console.log("not logged in");}
    
}
middleWare.isLoggedIn = function(req,res,next) 
{
    if(req.isAuthenticated())
    {  console.log("authhhh")
       if(req.user.isverified)
       {
        return next();

       }
    }
    req.flash("error","please login first");
   res.redirect("/login");
}
middleWare.CheckCurrentUser = function(req,res,next){
        if(req.isAuthenticated())
          { camp.findById(req.params.id,function(err,UpdateCamp)
              {
                  if(err || !UpdateCamp)
                  {    req.flash("error","campground not found");
                      console.log(err);
                      res.redirect("back");
                  }
                  else
                  {  
                      if(UpdateCamp.author.id.equals(req.user._id))
                      {
                          
                          return next();
                      }
                      else
                          {   req.flash("error","user not matched");
                              res.send("invalid authorization");
                         }
                  }
              });
      }
      else
      {res.redirect("back");}}

      middleWare.checkOwnership = function(req,res,next)
    { console.log(req.user.isOwner);
        if(req.user.isOwner||req.user.isAdmin)
        {
            return next();
        }
        else
        {
            req.flash("error","you need to register as an owner");
            res.redirect("back");
        }
    }

module.exports= middleWare;