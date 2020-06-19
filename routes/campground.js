require("dotenv").config();
var key      = process.env.OCD_KEY;
var express = require("express"),
    router  = express.Router(),
    camp    = require("../models/camp"),
    comment = require("../models/comment"),
    user    = require("../models/user"),
    middleWare = require("../middleware"),
    NodegeoCoder = require("node-geocoder");
    
    
    var options = {
      provider: 'opencage',
     
      // Optional depending on the providers
      httpAdapter: 'https',
      apiKey: key, // for Mapquest, OpenCage, Google Premier
      formatter:null
    };
    var geocoder = NodegeoCoder(options);
router.get("/campgrounds",function(req,res)
{ 
if(req.query.search)
{var noMatch;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    camp.find({ "name": regex }, function(err, camps) {
        if(err) {
            console.log(err);
        } else {
            
            if(camps.length<1)
            {
                 noMatch ="doesnot match";
            }
        res.render("camps/campgrounds",{campgrounds:camps,currentUser:req.user,noMatch:noMatch});
           
        }
})
}
else
{camp.find({},function(err,camps)
{ 
    if(err)
    {
        console.log(err);
    }
    else
    {
        res.render("camps/campgrounds",{campgrounds:camps,currentUser:req.user,noMatch:noMatch});

    }
}
)
}}
);
router.post("/campgrounds",middleWare.isLoggedIn,  function(req,res)
{
  var name = req.body.Name;
  var image = req.body.campUrl;
  var description = req.body.description;
  var createrName = req.user.username;
  var id = req.user._id;
  var price = req.body.price;
var location= req.body.location;
  var author ={id:id,createrName:createrName};
  geocoder.geocode(req.body.location, function(err, data){
    if(err || !data.length){
        req.flash('error', 'Invalid address');
        return res.redirect('back');
    }
   console.log(data);
     var lat = data[0].latitude;
      var lng  =  data[0].longitude;
      
    console.log(location);
    console.log(lat);
    console.log(lng);
  var newCampground = {name: name, image: image,description:description, author:author,price:price,lat:lat,lng:lng,location:location};
  camp.create(newCampground,function(err,camp)
  {
      if (err)
      {
          console.log(err);
      }
      else
      { console.log(camp);
        res.redirect("/campgrounds");

      }
  })
    
});

}) ;
router.get("/campgrounds/new",middleWare.isLoggedIn,middleWare.checkOwnership,function(req,res)
{
    res.render("camps/new");
}
);
router.get("/campgrounds/:id", async function(req,res)
{ try{
  var foundcamp = await camp.findById(req.params.id).populate("comments").exec();
  if(foundcamp != undefined)
  {
    res.render("camps/show",{foundcamp:foundcamp});
  }
  else
  {
    req.flash("error","campground not found");
    res.redirect("/campgrounds");
  }
}catch(e){
  console.log(e);
}}

);
router.get("/campgrounds/:id/update",middleWare.CheckCurrentUser,function(req,res)
{   
    camp.findById(req.params.id,function(err,UpdateCamp)
    {   
      res.render("camps/update",{UpdateCamp:UpdateCamp});
    }
    )
}
);
router.put("/campgrounds/:id/update",middleWare.CheckCurrentUser,function(req,res)
{ var name = req.body.yelp.name;
    var image = req.body.yelp.campUrl;
    var description = req.body.yelp.description;
   var price = req.body.yelp.price;
    geocoder.geocode(req.body.yelp.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var updatedCamp = {name: name, image: image,description:description,price:price,lat:lat,lng:lng,location:location
                            }
    
    camp.findByIdAndUpdate(req.params.id,updatedCamp,function(err,foundcamp)
    {
        if(err)
        {console.log(err);
            req.flash("error", err.message);
            res.redirect("back");}
    
    else
    { console.log(foundcamp);
        res.redirect("/campgrounds/"+req.params.id);
    }
    
})
})
});
router.delete("/campgrounds/:id",middleWare.CheckCurrentUser,async(req,res)=>{
    try {
      let foundCampground = await camp.findById(req.params.id);
      await foundCampground.remove();
      req.flash("success","sucessfully deleted the campground");
      res.redirect("/campgrounds");
    } catch (error) {
        req.flash("error","Camground not deleted!Please try again");
      res.redirect("/campgrounds");
    }
  });
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports= router;