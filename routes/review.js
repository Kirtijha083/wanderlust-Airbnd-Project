const express = require("express"); //require express
const router = express.Router({ mergeParams:true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
// const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");


const ReviewController = require("../controllers/review"); // requiring review.js from controllers(folder)


// Reviews --> (// post review route) isme baad me reviewschema wala middleware v add kiye h (validateReview wala)
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

// export this file
module.exports = router;