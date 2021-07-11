const express = require("express");
const passport = require("passport");
const moment = require("moment");
const isAuthenticated = require("../middleware/auth")
const {
  ensureAuthenticated,
  ensureAdmin,
  ensureNotAuthenticated,
} = require("../middleware/auth");
const spGames = require("../model/spGames");
const router = express.Router();
const {
  validatePassword,
  validateEmail,
  validateUsername,
} = require("../utils/utils");
const multer = require('multer');
const path = require('path');

function getIsAdmin(user) {
  let isAdmin = false;
  if (user && user.role === "Admin") {
    isAdmin = true;
  }
  return isAdmin;
}

router.get("/", (req, res) => {
  res.render("index", {
    isAuthenticated: req.isAuthenticated(),
    isAdmin: getIsAdmin(req.user),
  });
});

router.get("/login", ensureNotAuthenticated, (req, res) => res.render("login"));

router.get("/signup", ensureNotAuthenticated, (req, res) =>
  res.render("signup")
);

router.get("/aboutus", isAuthenticated, (req, res) =>
  res.render("aboutus")
);

router.get("/admin", ensureAdmin, (req, res) => {
  let games = [];
  let categories = [];
  spGames.getAllGames((err, rows) => {
    games = rows;
    spGames.getAllCategories((err, rows) => {
      categories = rows;
      res.render("admin", {
        games,
        categories,
        isAdmin: true,
        isAuthenticated: true,
      });
    });
  });
});

router.get("/game/:id", (req, res) => {
  const { id } = req.params;
  let game;
  let reviews;
  spGames.getGame(id, (err, rows) => {
    game = rows[0];
    spGames.getReviewForGame(id, (err, rows) => {
      reviews = rows;
      res.render("game", {
        game,
        reviews,
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        isAdmin: getIsAdmin(req.user),
      });
    });
  });
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    user: req.user,
    isAdmin: getIsAdmin(req.user),
    isAuthenticated: true,
  });
});

// POST /signup
router.post("/signup", (req, res) => {
  const { email, password, username, profile_pic_url, type } = req.body;
  if (!email || !password || !username || !profile_pic_url || !type) {
    return res.render("signup", {
      errors: ["Please enter all fields."],
      email,
      password,
      username,
      profile_pic_url,
      type,
    });
  }

  // Validate all fields
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const usernameError = validateUsername(username);
  let errors = [];
  if (emailError) {
    errors.push(emailError);
  }
  if (passwordError) {
    errors.push(passwordError);
  }
  if (usernameError) {
    errors.push(usernameError);
  }
  if (emailError || passwordError || usernameError) {
    return res.render("signup", {
      errors,
      email,
      password,
      username,
      profile_pic_url,
      type,
    });
  }

  // Find matching user
  spGames.getUserByEmail(email, (err, rows) => {
    if (rows.length !== 0) {
      return res.render("signup", {
        errors: ["An account already exists with that email."],
        email,
        password,
        username,
        profile_pic_url,
        type,
      });
    } else {
      // Insert new user to db
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      spGames.insertIntoUsers(
        username,
        email,
        type,
        profile_pic_url,
        date,
        password,
        (err, rows) => {
          return res.render("signup", {
            errors: [],
            success_msg: "Registration is successful!",
          });
        }
      );
    }
  });
});

// GET /logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// POST /login
router.post("/login", (req, res, next) => {
  // Validate email and password
  const { email, password } = req.body;
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  let errors = [];
  if (emailError) {
    errors.push(emailError);
  }
  if (passwordError) {
    errors.push(passwordError);
  }
  if (emailError || passwordError) {
    return res.render("login", {
      errors,
      email,
      password,
    });
  }

  // Try to log in user
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Images API
// Upload an jpgeg image under 1MB 

// Set Storage Engine 
const storage = multer.diskStorage({
  destination: './public/assets/img',
  filename: function (req, file, callback){
      callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
  });
  
// initialize upload
const upload = multer({
      storage: storage,
      limits:{fileSize: 1000000}, // limit the file size to 1MB
      fileFilter: function(req, file, callback){
          checkFileTypeforJpeg(file, callback);     
      }
  }).single('SP_Games');
  
// Check File Type for Jpeg
function checkFileTypeforJpeg(file, callback){
      // Allowed file type extension
      const filetypes = /jpeg|jpg/;
      // Check extension 
      const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
      // Check mime type
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
          return callback (null,true);
      } else {
          callback('Error: Jpeg Images Only!');
      }
  }
  
  
// initialize app 
const app = express();
  
// EJS 
app.set('view engine', 'ejs');
  
router.get('/upload', (req, res) => res.render('upload'));

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
      if(err){ 
        res.render('upload', {
              msg: err
        });
  }  else {
      if (req.file == undefined) { // Check if there is a File Selected
          res.render('upload', {
              msg: 'Error: No File Selected!'
          });
      } else {
        res.render('upload', {
        msg: 'File Succefully Uploaded!',
        file: `assets/img/${req.file.filename}`
      
        });
      }
     console.log(req.file);
     //res.send('test');
  }
});
});

// Error handling 
const callback = (err, res, statusCode, data) => {
if (err) {
  return res.status(500).send({ err });
} else {
  return res.status(statusCode).send(data);
}
}

module.exports = router;
