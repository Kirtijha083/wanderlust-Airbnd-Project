const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};//get route for signup

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body; //extracting
      const newUser = new User({ email, username }); //creating newUsers with username and email
      const registeredUser = await User.register(newUser, password); //for registering in db
      console.log(registeredUser);
      req.login(registeredUser, (err) => { //isse signup ke baad khud hi login ho jyega
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
}; //signUp post route

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
}; //login route get

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //jb res.locals.redirectUrl ka value undefine hoga to/listings me redirect hoga page after login
    res.redirect(redirectUrl); //accessing from middleware.js file
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
      //logout me callback pass kiya jata h jaise yaha err ko pass kiye hai
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!!");
      res.redirect("/listings");
    });
};