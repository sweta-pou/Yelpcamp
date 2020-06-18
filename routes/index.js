var express    = require("express"),
     router    = express.Router(),
       user    =require("../models/user"),
      passport = require("passport");
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
var gender = req.body.gender;
var newUser = new user({username:username,phoneNumber:phoneNumber,city:city,gender:gender});
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
    if(err)
    {
        console.log(err);
        req.flash("error",err.message);
        res.redirect("/register");
    }
    else
    {
        passport.authenticate("local")(req,res,function()
       {  if(user.isOwner){
           req.flash( "success","Welcome to Yelpcamp ! Successfully registered as campground owner.Post about your campgrounds.")}
           else if(user.isAdmin)
           {
            req.flash( "success","Welcome to Yelpcamp ! Successfully registered as admin.");
           }
           else
           {
            req.flash( "success","Welcome to Yelpcamp ! Successfully registered as user.");

           }
           res.redirect("campgrounds");
           console.log(user);
        })
    }
})
});
router.get("/login",function(req,res)
{
    res.render("user/login");
});
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login",
    successFlash:"Successfully logged in! ",
    failureFlash:"Please try again"
    
}),function(req,res)
{
 
});

router.get("/logout",function(req,res)
{
    req.logOut();
    res.redirect("/");
});

 module.exports = router;