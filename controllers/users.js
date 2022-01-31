const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("user/register");
};

module.exports.registerNewUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", `${e.message}`);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("user/login");
};

module.exports.loginNewUser = (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectTo = req.session.lastPage || "/campgrounds";
  delete req.session.lastPage;
  res.redirect(redirectTo);
};

module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};
