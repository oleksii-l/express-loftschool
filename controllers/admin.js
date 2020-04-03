const db = require("../db");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: __dirname + "/.env" });

exports.getAllSkills = () => {
  let result = db.get("skills").value();
  return result;
};

exports.getAllProducts = () => {
  let result = db.get("products").value();
  return result;
};

exports.email = async body => {
  const { name, email, message } = body;
  try {
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "oleksii.leshchenko@gmail.com",
      from: email,
      subject: `Sending email from ${name}`,
      text: message
    };
    await sgMail.send(msg);
  } catch (err) {
    console.error(`Error happenned during sending Email: ${err}`);
  }
  console.log("Email successfully sent...");
};

exports.saveSkills = ({ age, concerts, cities, years }) => {
  db.get("skills")
    .remove()
    .write();

  db.get("skills")
    .push([
      {
        number: age,
        text: "Возраст начала занятий на скрипке"
      },
      {
        number: concerts,
        text: "Концертов отыграл"
      },
      {
        number: cities,
        text: "Максимальное число городов в туре"
      },
      {
        number: years,
        text: "Лет на сцене в качестве скрипача"
      }
    ])
    .write();
};

exports.saveProduct = ({ name, price, file }) => {
  db.get("products")
    .push({
      src: path.join(".", "images", "products", file),
      name,
      price
    })
    .write();
};
