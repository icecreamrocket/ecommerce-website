const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");

// Initialise app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up passport
require("./config/passport")(passport);
app.use(
  session({
    secret: "ilovescotchscotchyscotchscotch",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // cookie expires in 1h
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Connect flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Set up EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Set up routes
const frontendRoutes = require("./controller/views.js");
const routes = require("./controller/app.js");
app.use("/", frontendRoutes);
app.use("/api", routes);

// Set up port
const port = process.env.PORT || 8081;

const server = app.listen(port, function () {
  console.log("App hosted at localhost:" + port);
});
