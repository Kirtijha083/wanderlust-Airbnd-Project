const express = require("express"); //require express
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
// const ExpressError = require("../utils/ExpressError");
// const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing"); // requiring listing.js from controllers(folder)
const multer  = require('multer'); //requiring multer....for file upload ke liye
const { storage } = require("../cloudConfig");//require cloudConfig.js file
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index)) //index route
.post(
  isLoggedIn,
  // validateListing,
  upload.single("listing[image]"), //multer ke through img save(cloud me) hone ke liye
  validateListing,
  wrapAsync(listingController.createListing) //create route
);
// .post(upload.single("listing[image]"),(req, res) => {
//   res.send(req.file);
// });

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), //multer ke through img save(cloud me) hone ke liye-->img edit ke baad save hoga iske through
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


// export this file
module.exports = router;
