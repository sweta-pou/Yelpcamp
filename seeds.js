var mongoose = require ("mongoose"),
    camp = require("./models/camp"),
     comment = require("./models/comment");
var data=[
    {
        name:"rome",
        image:"https://images.unsplash.com/photo-1578031387549-d0f06cd1018b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"this is a campground which is located in a peaceful environment"   
      },
      {
        name:"turkey",
        image:"https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"this is a campground which is located in Turkey"   
      }
]

function seedDB(){
    // camp.deleteMany({},function(err)
    // {
    //     if (err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {
    //         console.log("removed");
    //         data.forEach(function(created){
    //         camp.create(created, function(err,campground)
    //         {
    //             if(err)
    //             {
    //                 console.log(err);
    //             }
    //             else
    //             {
    //                 console.log("added a campground");
    //                 comment.create({
    //                     text:"yes!would love to visit this campground",
    //                     author:"holmes"
    //                 },function(err,added)
    //                 {
    //                     if(err)
    //                     {
    //                         console.log(err);
    //                     }
    //                     else
    //                     {
    //                         campground.comments.push(added);
    //                         campground.save(function(err)
    //                         {
    //                             if(err)
    //                             {
    //                                 console.log(err);
    //                             }
    //                             else
    //                             {
    //                                 console.log("done");
    //                             }
    //                         }
    //                         )
    //                     }
    //                 }
    //                 )
    //             }
    //         }
    //         )}
    //         )
    //     }
    // }
    // )
}
module.exports = seedDB;
