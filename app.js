require('dotenv').config();
var express = require("express"),
     app = express(),
     bodyParsor = require("body-parser"),
     mongoose = require("mongoose"),
     passport = require("passport"),
     flash = require ("connect-flash"),
     LocalStrategy = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose"),
     camp = require("./models/camp"),
     comment = require("./models/comment"),
     user = require("./models/user"),
    methodOverride = require("method-override"),
      seedDB = require("./seeds");
      var moment = require('moment');
      app.locals.moment = moment;

var campgroundsRoute = require("./routes/campground"),
    commentRoute = require("./routes/comment"),
    indexRoute = require("./routes/index");
const axios = require("axios");
mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true });

mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParsor.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(require("express-session")(
{
    secret:"this is yelpcamp",
    resave:false,
    saveUninitialized:false
}
));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next)
{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
}
)
app.use(indexRoute);
app.use(campgroundsRoute);
app.use(commentRoute);
//Schema
 seedDB();
 var port = process.env.PORT || 1000;
 
app.listen(port,function()
{
    console.log("Yelp camp started!!!");
}
);