//ENVIRONMENT VARIABLES
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//IMPORTS
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

//LISTEN ON PORT
app.listen(port);

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(express.static("styles"));
app.use("/styles", express.static(__dirname + "/style"));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//
const users = [];

//ROUTES
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

//register route
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

//application to login as a user
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//register route
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

//application for registering users
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("./login");
});

//PROTECTING OUR ROUTES
// this will stop users from redirecting in the address bar
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("./login");
}

// this will stop users from going to the login page if they are already logged in...
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

console.log("listening on port", port);
