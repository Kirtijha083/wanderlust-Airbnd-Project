const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    //    console.log(allListing); // Check if image.url exists
    res.render("listings/index.ejs", { allListing });
}; //index route

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}; //new route

module.exports.showListing = async (req, res, next) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        //console.log(listing);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            // res.redirect("/listings");
            return res.redirect("/listings"); // Add return to stop further execution
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
}; //show routes

module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body // ye method v kr sakte the...
    //let listing = req.body.listing;
    //console.log(listing);
    //   if(!req.body.listing){
    //     throw new ExpressError (404, "Send valid data for listing");
    //   }

    //server side schema validation rule ke according => joi ke through
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError (400,result.error);
    // }
    let url = req.file.path; //accessing url and filename from img (and img ka details req.file me hota hai)
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); //req.body.listing ye new.ejs me jo naya listing aayega vo object->key value pair me stotre hoga and yaha vhi access ho rha
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    // console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}; //create route

module.exports.renderEditForm = async (req, res, next) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            // res.redirect("/listings");
            return res.redirect("/listings"); // Add return to stop further execution
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
}; //edit route

module.exports.updateListing = async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(404, "Send valid data for listing");
    // }
    let { id } = req.params;
    // console.log(req.body.listing); // Log the form data
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );
    if(typeof req.file != "undefined"){ //yani yadi file(image) me kch v change na ho to v save ho jye shi se
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    //res.redirect("/listings");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}; //update route

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!"); //for flash msg for delete
    res.redirect("/listings");
}; //delete/destroy route

