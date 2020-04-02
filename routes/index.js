var express = require("express");
var router = express.Router();

const adminCtrl = require("../controllers/admin");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

/* GET home page. */
router.get("/", function(req, res, next) {
  const skills = adminCtrl.getAllSkills();
  const products = adminCtrl.getAllProducts();

  res.render("index", { skills, products });
});

router.post("/", function(req, res, next) {
  adminCtrl.email(req.body);
});

router.get("/login", function(req, res, next) {
  res.render("login");
});

router.post("/login", function(req, res, next) {
  res.redirect("admin");
});

router.get("/admin", function(req, res, next) {
  res.render("admin");
});

router.post("/admin/skills", function(req, res, next) {
  console.log(req.body);
  adminCtrl.saveSkills(req.body);

  res.redirect('/');
});

router.post("/admin/upload", function(req, res, next) {
  let form = new formidable.IncomingForm();
  form.uploadDir =path.join(process.cwd(), 'public', 'images', 'products');
  form.parse(req, function(err, fields, files) {
    const oldpath = files.photo.path;
    const newpath = path.join(process.cwd(), 'public', 'images', 'products', files.photo.name);
    console.log(`oldpath=${oldpath}, newpath=${newpath}`);
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
  });

  res.redirect("/admin");
});

module.exports = router;
