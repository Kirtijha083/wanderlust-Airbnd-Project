const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    // console.log(req.params.id)
    let listing = await Listing.findById(req.params.id); //params yani parameter me id pass krenge to hmko listing find kr ke dega...then usko await kr k ek value(listing) me save kr lenge
    //creating new review
    let newReview = new Review(req.body.review); //yani yaha to req ki body me jo review save hoga vo yaha store hoga...yahi show.ejs se jo review object me sb save hoga comment, rating....
   
    newReview.author = req.user._id; // review push yani add hone se phele...newReview me uska author save hoga........yani jo user login krega uska user_id
    // console.log(newReview);

    listing.reviews.push(newReview); //yaha uper wale listing ka jo reviews array hoga(jo ki hm model me bnaye h listing wale me review wala)...to yaha hm newReview ko push krenge
    await newReview.save();
    await listing.save();//then dono ko db me save krenge
    // console.log("New review saved");
    // res.send("New review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}; //create review

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    //but saath ke saath hmko listing ke ander review ke ander ke array ko v delete krne hoga......to uske liye hm findby id and update krenge listing ko....or uske liye reviews array se revirw id ko delete krna hoga....and iske liye hm mongoosh ka ek special operator use krte h which is..mongo pull operator 
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // yahi yaha pull krna yani delete krna...to hm pull krenge reviews ke ander se reviewId ko
    await Review.findByIdAndDelete(reviewId); //ab yaha hm review ke ander find by id and delete kr ke review ki id pass kr ke isko await kr denge.........to isse review to delete ho jyega
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`); //delete ke baad show page pe rediret kr denge
}; //delete review