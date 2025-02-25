const express = require("express"); //require express
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport"); //require passport
const {saveRedirectUrl} = require("../middleware");


const userController = require("../controllers/user"); // requiring user.js from controllers(folder)

// for signup
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));


// for login
router.route("/login")
.get(userController.renderLogInForm)
.post(
  saveRedirectUrl, //ye middleware h from middleware.js file se
  passport.authenticate("local", {
    //user hai ya nhi register phele se ye..passport.authenticate btayega..and kon sa stratgies add kiye h..local
    failureRedirect: "/login", //then yadi login nhi ho paya to redirect to..failureRedirect:'/login'..this page
    failureFlash: true, //ye isly ki yadi kch error ho to flash msg show ho
  }),
  userController.logIn
);


// for logout
router.get("/logout", userController.logOut);

// export this file
module.exports = router;
