var express = require("express"),
    router  = express.Router(),
    camp    = require("../models/camp"),
    comment = require("../models/comment"),
    user = require("../models/user"),
    middleWare = require("../middleware");
    
router.get("/campgrounds/:id/comments/new",middleWare.isLoggedIn,function(req,res)
{  camp.findById(req.params.id,function(err,foundComment)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
         res.render("comments/new",{foundComment:foundComment});
        }
    }
)
});
router.post("/campgrounds/:id/comments",middleWare.isLoggedIn,function(req,res)
{
    camp.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            comment.create(req.body.comments,function(err,added)
            {
                if(err)
                {
                    console.log(err);

                }
                else
                {  console.log(req.user);
                    console.log(req.user._id);
                    
                     added.author.id = req.user._id;
                    added.author.username = req.user.username;
                    added.save();
                    console.log(added);
                    campground.comments.push(added);
                    campground.save();

                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    }
    )

});
router.get("/campgrounds/:id/comments/:comment_id/edit",middleWare.CommentUserCheck,function(req,res)
{    
    comment.findById(req.params.comment_id,function(err,foundComment)
    {
        if(err){console.log(err);}
        else
        {
            res.render("comments/edit",{foundComment:foundComment,campgroundId:req.params.id});
        }
    }
    )
  }  );
router.put("/campgrounds/:id/comments/:comment_id",middleWare.CommentUserCheck,function(req,res)
{  
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){console.log(err);}
        else
        {
            
            res.redirect("/campgrounds/"+req.params.id);
        }
    }
    
    )
}
);
router.delete("/campgrounds/:id/comments/:comment_id/delete",middleWare.CommentUserCheck,function(req,res)
{
    comment.findByIdAndRemove(req.params.comment_id,function(err)
    {
        if(err){console.log(err);}
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    }

    )
}
)
module.exports= router;

