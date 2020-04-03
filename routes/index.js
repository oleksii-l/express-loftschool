var express = require("express");
var router = express.Router();
const passport = require("passport");

const adminCtrl = require("../controllers/admin");
const validation = require("../libs/validation");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/* GET home page. */
router.get("/", function(req, res, next) {
  const skills = adminCtrl.getAllSkills();
  const products = adminCtrl.getAllProducts();

  res.render("index", { skills, products, msgemail: req.flash("emailMessage") });
});

router.post("/", function(req, res, next) {
  const error = validation.isValidEmail(req);
  if(error) {
    const message = error.details.map(item => item.message).join("; ");
    req.flash("emailMessage", message);
  } else {
    adminCtrl.email(req.body);
    req.flash("emailMessage", 'Email was successfully sent');
  }
  res.redirect('#sendemail');
});

router.get("/login", function(req, res, next) {
  res.render("login", { msglogin: req.flash("message") });
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("message", "Укажите правильный email и пароль");
      res.redirect("/login");
    }
    req.login(user, err => {
      res.redirect("admin"); //auth successfully passed
    });
  })(req, res, next);
});

router.get("/admin", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("admin", {
      msgskill: req.flash("skillsMessage"),
      msgfile: req.flash("productMessage")
    });
  } else {
    res.status(403).send("Доступ запрещен");
  }
});

router.post("/admin/skills", function(req, res, next) {
  const error = validation.isValidSkills(req, res, next);
  console.log(`RESULT=${error}`);
  if (error) {
    const message = error.details.map(item => item.message).join("; ");
    req.flash("skillsMessage", message);
    res.redirect("/admin");
  } else {
    adminCtrl.saveSkills(req.body);
    res.redirect("/");
  }
});

router.post("/admin/upload", function(req, res, next) {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public", "images", "products");
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.flash("productMessage", err);
    }

    const oldpath = files.photo.path;
    const newpath = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      files.photo.name
    );
    const { name, price } = fields;
    const error = validation.isValidProduct({
      name,
      price,
      file: files.photo.name
    });
    if (error) {
      const message = error.details.map(item => item.message).join("; ");
      req.flash("productMessage", message);
    } else {
      adminCtrl.saveProduct({ name, price, file: files.photo.name });
      fs.rename(oldpath, newpath, function(err) {
        if (err) {
          res.flash("productMessage", err);
          console.error(err);
        }
      });
    }

    res.redirect("/admin");
  });
});

module.exports = router;
