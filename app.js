if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
// const { listingSchema, reviewSchema } = require("./schema");
// const Review = require("./models/review");
const session = require("express-session"); //require express-session
const MongoStore = require('connect-mongo'); //require mongo-session(connect-mongo)-->jo ki humara mongoStore ko create krega
const flash = require("connect-flash"); //require flash
const passport = require("passport"); //require passport
const LocalStrategy = require("passport-local"); //require passport-local
const User = require("./models/user"); //require usermodel



const listingRouter = require("./routes/listing"); //require listing.js file
const reviewRouter = require("./routes/review"); //require review.js file
const userRouter = require("./routes/user"); //require user.js file

// const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs"); //for ejs
app.set("views", path.join(__dirname, "views")); //for views folder
app.use(express.urlencoded({ extended: true })); //taki sara data express me parse ho pye...req.body me
app.use(express.static(path.join(__dirname, "/public"))); //for acessing public folder(like,css files)
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates
app.engine('ejs', ejsMate);

const store = MongoStore.create({ //it is a method for creating mongo store
    mongoUrl: dbUrl, 
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, //24 ghanta in second
});

store.on("error", () =>{    //when error occour in mongo store
    console.log("Error in Mongo Session Store", err);
});

const sessionOption = { //defining express(session-option)
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// root route
// app.get("/", (req, res) => {
//     console.log("working!");
//     res.send("Hii, I am root..!");
// });

app.use(session(sessionOption)); //for using session-option
app.use(flash());

app.use(passport.initialize()); //initilize passport
app.use(passport.session()); //also use passport with session
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware for res.local -> flash msg
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// demo route for user model --> storing 1 user for demo
// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser); 
// });        //..............isko bs demo ke liye hi use kiye the



app.use("/listings", listingRouter); // then use - listingRouter
app.use("/listings/:id/reviews", reviewRouter); // then use - reviewRouter
app.use("/", userRouter); // then use - userRouter

// //creating 1st document in collection
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title:"My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved!");
//     console.log(sampleListing);
//     res.send("Successful testing");
// });


// for all non existing route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found..!"));
});

//custom error handling middleware
app.use((err, req, res, next) => {
    //res.send("Something went wrong..!");
    let { statusCode = 500, message = "Something went wrong..!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to port: 8080");
});