const Listing = require("./models/listing"); //require listing for 3rd middleware
const Review = require("./models/review"); //require review for isReviewAuthor middleware
const ExpressError = require("./utils/ExpressError"); //iss ko validatelisting and validatereview middleware ke liye require kiye
const { listingSchema, reviewSchema } = require("./schema"); //iss ko validatelisting and validatereview middleware ke liye require kiye


module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //for saving information of user those who is not logged-in
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

// for saving redirectUrl info
module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

// for checking owner of the listing
module.exports.isOwner = async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this listing!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// for validateListing middleware copy & cut from listing.js(routes folder)
//joi se related code k function in terms of middleware
// joi function for validate listing(serverside validation for listing model(schema))
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
  } else {
      next();
  }
};


// joi function for validate review(serverside validation for review model(schema))
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
  } else {
      next();
  }
};


// for checking author of the review
module.exports.isReviewAuthor = async (req,res,next) => {
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the author of this review!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};