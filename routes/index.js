require('dotenv').config();

var express    = require("express"),
     router    = express.Router(),
       user    =require("../models/user"),
      passport = require("passport"),
      mailgun = require("mailgun-js"),
      crypto = require("crypto"),
      token = require("../models/token"),
      emailCheck = require("email-check");
      const axios = require('axios').default;



const DOMAIN = process.env.Domain;
const mg = mailgun({apiKey: process.env.Mailgun_API, domain: DOMAIN});
router.get("/",function(req,res)
{
    res.render("landing");
}
);
router.get("/register",function(req,res)
{
    res.render("user/register");
}
);
router.post("/register",function(req,res){
var username = req.body.username;
var password = req.body.password;
var phoneNumber = req.body.phoneNumber;
var city = req.body.city;
var email = req.body.email;
var gender = req.body.gender;

user.findOne({email:req.body.email},function(err,users)
{
    if(users)
    {
        req.flash("error","Email already exists");
        res.redirect("back");
    }
    else
    {
        //  const id=Math.floor((Math.random() * 100) + 54);
        //  const hostes = req.get('host');
        
        
            var  newUser = new user({username:username,phoneNumber:phoneNumber,city:city,gender:gender,email:email});
            if(req.body.admin ==="shaha")
            {
                newUser.isAdmin = true;
            }
           if(req.body.category === "owner")
          {
              newUser.isOwner = true;
          }
            user.register(newUser,password,function(err,user)
            {
                if(err){console.log(err);}
                else
                {
                    var tokens = new token({ user_id: user._id, token: crypto.randomBytes(16).toString('hex') });
                       tokens.save(function(err,token)
                       {
                           if(err){console.log(err);}
                           else
                           {
                               var token = token.token;
                            const data = {
                                from: 'yelpcamp@campground.com',
                                to: req.body.email,
                                subject: 'Yelpcamp Verification',
                                html:`Hello,<br> Please Click on the link to verify your email.<br> <a href="http://localhost:1000/verification?verify=${token}">click here</a>`
                            };
                            mg.messages().send(data, function (error, body) {
                                console.log(body);
                            });
                            req.flash("success","Please check your email to confirm your signup");
                            res.redirect("back");
                           }
                       }
                       );
                }
            }
            );
 
    }
}
)
    
});
router.get("/verification",function(req,res)
{
    // console.log(req.protocol);
    // console.log(hostes);
    // console.log(req.protocol+":/"+req.get('host'));
    // console.log(req.query);
    // console.log(id);
   console.log(req.query.verify);
    token.findOne({token:req.query.verify},function(err,Token)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(!Token)
            {
               console.log("token not found");
               res.send("token not found.Your token may have been expired.Please get the new confirmation link .");

            }
            else
            {
                user.findOne({_id:Token.user_id},function(err,FoundUSer)
                {
                    if(err){console.log(err);}
                    else
                    {
                        FoundUSer.isverified =true;
                        FoundUSer.save(err)
                        {
                            if(err){console.log(err);}
                            else
                            {
                                console.log("the account has been verified");
                                res.send("account verrified.Please login .");
                            }
                        }
                    }
                }
                )
            }
        }
    }
    )
}
)

router.get("/login",function(req,res)
{
    res.render("user/login");
});
router.post("/login",passport.authenticate('local', 
{ failureFlash: 'Invalid username or password.',
   failureRedirect:'/login'}),
   function(req,res){
    user.findOne({username:req.body.username},function(err,user)
    {
        if(err){console.log(err);}
        else
        {
            if(user.isverified)
            {
              req.flash("success","Sucessfully loggedin");  

              res.redirect("/campgrounds");
            }
            else
            {
                req.flash("error","the account has not been verified");

                res.redirect("/confirmation");
            }
        }
    }
    )
            
});
router.get("/confirmation",function (req,res)
{
  res.render("user/confirmation");
});
router.post("/confirmation",function(req,res)
{
    user.findOne({email:req.body.email},function(err,user)
    {
        if(err){console.log(err);}
        else
        {
            if(!user)
            {
                req.flash("error","This email has not been registered.Please Signup.");
                res.redirect("back");
            }
            else
            {
                var tokens = new token({ user_id: user._id, token: crypto.randomBytes(16).toString('hex') });
                       tokens.save(function(err,token)
                       {
                           if(err){console.log(err);}
                           else
                           {
                               var token = token.token;
                            const data = {
                                from: 'yelpcamp@campground.com',
                                to: req.body.email,
                                subject: 'Yelpcamp Verification',
                                html:`Hello,<br> Please Click on the link to verify your email.<br> <a href="http://localhost:1000/verification?verify=${token}">click here</a>`
                            };
                            mg.messages().send(data, function (error, body) {
                                console.log(body);
                            });
                            req.flash("success","Please check your email to confirm the signup");
                            res.redirect("back");
                           }
                       }
                       );
            }

        }
    }
    )
}
)
router.get("/logout",function(req,res)
{
    req.logOut();
    res.redirect("/");
});

 module.exports = router;
 