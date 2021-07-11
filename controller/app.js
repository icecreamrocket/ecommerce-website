// Hagen Li Yong Jun
// P2040279
// DIT/1B/06
// 30/12/20
// BED CA1 ASSIGNMENT

// What is the assignment about:
// SP Games has tasked you to design the backend API specs for SP Games. The API
// specs would support functionalities such as user registration, displaying and entry of
// games info, user reviews.

// Additional Requirments includes:
// 1) Interface and API Endpoint for image file uploading limit unser 1MB.
// 2) Enable a game to be assigned to more than 1 category (many-to-many relationship for game to category).
// 3) Login Form that stores user and password in MYSQL Database.

// Importing of modules
const express = require("express");
const multer = require("multer");
const moment = require("moment");
const router = express.Router();
const path = require("path");
const ejs = require("ejs");
const spGames = require("../model/spGames");
const pool = require('../config/databaseConfig');

// const bcrypt = require("bcrypt");
const passport = require("passport");
const { ensureAuthenticated, ensureAdmin } = require("../middleware/auth");

// // Set Storage Engine
// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function (req, file, callback) {
//     callback(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// // initialize upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // limit the file size to 1MB
//   fileFilter: function (req, file, callback) {
//     checkFileTypeforJpeg(file, callback);
//   },
// }).single("SP_Games");

// // Check File Type for Jpeg
// function checkFileTypeforJpeg(file, callback) {
//   // Allowed file type extension
//   const filetypes = /jpeg|jpg/;
//   // Check extension
//   const extname = filetypes.test(
//     path.extname(file.originalname).toLocaleLowerCase()
//   );
//   // Check mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return callback(null, true);  
//   } else {
//     callback("Error: Jpeg Images Only!");
//   }
// }

// Public Folder
// router.use(express.static('./public'));
    
// router.get('/upload', (req, res) => res.render('upload'));
    

// Upload an jpgeg image under 1MB
// router.post("/upload", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.render("index", {
//         msg: err,
//       });
//     } else {
//       if (req.file == undefined) {
//         // Check if there is a File Selected
//         res.render("index", {
//           msg: "Error: No File Selected!",
//         });
//       } else {
//         res.render("Index", {
//           msg: "File Succefully Uploaded!",
//           file: `uploads/${req.file.filename}`,
//         });
//       }
//       console.log(req.file);
//       //res.send('test');
//     }
//   });
// });

// Error handling
const callback = (err, res, statusCode, data) => {
  if (err) {
    return res.status(500).send({ err });
  } else {
    return res.status(statusCode).send(data);
  }
};

// First API, GET /users/
// Get all the array of all the users in the database who may be admin or customer type:
router.get("/users", (req, res) => {
  try {
    spGames.getAllUsers((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /users/:id
router.put("/users/:id", ensureAuthenticated, (req, res) => {
  const { username, email, profile_pic_url } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    spGames.updateUser(username, email, profile_pic_url, id, (err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Second API, POST /users/
router.post("/users", (req, res) => {
  try {
    const { username, email, type, profile_pic_url } = req.body;
    const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    spGames.insertIntoUsers(
      username,
      email,
      type,
      profile_pic_url,
      date,
      (err, rows) => {
        callback(err, res, 201, { userid: rows.insertId });
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Third API, GET /users/:id/
router.get("/users/:userid", (req, res) => {
  try {
    const { userid } = req.params;
    spGames.getUser(userid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /categories
router.get("/categories", (req, res) => {
  try {
    spGames.getAllCategories((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Fourth API, POST /category
router.post("/category", ensureAdmin, (req, res) => {
  try {
    const { catname, description } = req.body;
    const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    spGames.insertIntoCategory(catname, description, date, (err, rows) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return res
          .status(422)
          .send({ err: "The category name provided already exists." });
      }
      callback(err, res, 204, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// use this same concept for updating and posting reviews
// Fifth API, PUT /category/:id/
router.put("/category/:id", ensureAdmin, (req, res) => {
  try {
    const { catname, description } = req.body;
    const { id } = req.params;

    spGames.updateCategory(catname, description, id, (err, rows) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return res
          .status(422)
          .send({ err: "The category name provided already exists." });
      }
      callback(err, res, 204, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.delete("/category/:id", ensureAdmin, (req, res) => {
  try {
    const { id } = req.params;
    spGames.deleteCategory(id, (err, rows) => {
      callback(err, res, 204, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Sixth API, POST /game
// used to add a new game to the database
router.post("/game", ensureAdmin, (req, res) => {
  try {
    const { title, description, price, platform, category, year } = req.body;
    console.log(req.body);
    const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    spGames.insertIntoGame(
      title,
      description,
      price,
      platform,
      year,
      date,
      (err, rows) => {
        if (err) {
          throw err;
        }
        spGames.insertIntoBelongs(rows.gameid, category, (err, rows) => {
          // Return insert id if available, else there is an error
          console.log(err);

          //callback(err, res, 201, { gameid: rows ? rows.insertId : null });
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
});

// GET /games
router.get("/games", (req, res) => {
  try {
    spGames.getAllGames((err, rows) => {
      // callback(err, res, 200, rows);
      if(err){
        res.status(500)
      }
      res.send(rows).status(200).end()
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Seventh API, GET /games/:platform
router.get("/games/:platform", (req, res) => {
  try {
    const { platform } = req.params;
    spGames.getGameWithPlatform(platform, (err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Eighth API, DELETE /game/:id
router.delete("/game/:id", ensureAdmin, (req, res) => {
  try {
    const { id } = req.params;
    spGames.deleteGame(id, (err, rows) => {
      callback(err, res, 204, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Ninth API, PUT /game/:id
router.put("/game/:id", ensureAdmin, (req, res) => {
  try {
    const { title, description, price, platform, category, year } = req.body;
    const { id } = req.params;
    spGames.updateGame(
      title,
      description,
      price,
      platform,
      year,
      id,
      (err, rows) => {
        spGames.updateBelongs(id, category, (err, rows) => {
          callback(err, res, 204, null);
        });
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Tenth API, POST /user/:uid/game/:gid/review/
router.post("/user/:uid/game/:gid/review/", ensureAuthenticated, (req, res) => {
  try {
    const { content, rating } = req.body;
    const { uid, gid } = req.params;
    const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    spGames.insertIntoReview(content, rating, uid, gid, date, (err, rows) => {
      // Return insert id if available, else there is an error
      callback(err, res, 201, { reviewid: rows ? rows.insertId : null });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Eleventh API, GET /game/:id/review
router.get("/game/:id/review", (req, res) => {
  try {
    const { id } = req.params;
    spGames.getReviewForGame(id, (err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Twelfth API, POST /game/:gameid/category
router.post("/game/:gameid/category", (req, res) => {
  try {
    const { gameid } = req.params;
    const { categoryid } = req.body;
    spGames.insertIntoBelongs(gameid, categoryid, (err, rows) => {
      // Do not allow duplicate categories for the game
      if (err && err.code === "ER_DUP_ENTRY") {
        return res.status(422).send({
          error: "The category name provided already exists for the game.",
        });
      }
      callback(err, res, 201, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Thirteenth API, DELETE /game/:gameid/category/:categoryid
router.delete("/game/:gameid/category/:categoryid", (req, res) => {
  try {
    const { gameid, categoryid } = req.params;
    spGames.deleteBelongs(gameid, categoryid, (err, rows) => {
      callback(err, res, 204, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Fourteenth API, GET /game/:gameid/category
router.get("/game/:gameid/category", (req, res) => {
  try {
    const { gameid } = req.params;
    spGames.getGameCategories(gameid, (err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Fifteenth API,
router.get("/game", (req, res) => {
  try {
    spGames.getGame((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/games/:price/:title", (req, res) => {
  try {
    const { title, price } = req.params;
    if (price === "-1") {
      spGames.getGameByTitle(title, (err, rows) => {
        callback(err, res, 200, rows);
      });
    } else {
      spGames.getGameByTitleAndMaxPrice(title, price, (err, rows) => {
        callback(err, res, 200, rows);
      });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;
