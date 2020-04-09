const Joi = require("joi");
const fs = require("fs");
const util = require("util");
const unlink = util.promisify(fs.unlink);

module.exports.isValidSkills = (req, res, next) => {
  const schema = Joi.object({
    age: Joi.number()
      .min(15)
      .max(100)
      .required(),
    concerts: Joi.number().required(),
    cities: Joi.number().required(),
    years: Joi.number().required()
  });

  const { error } = Joi.validate(req.body, schema);
  console.log(error);
  return error;
};

module.exports.isValidProduct = product => {
  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .required(),
    price: Joi.number().required(),
    file: Joi.string().required()
  });

  const { error } = Joi.validate(product, schema);
  console.log(error);
  return error;
};

module.exports.isValidEmail = req => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .max(100)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    message: Joi.string()
      .max(1200)
      .required()
  });
  const { error } = Joi.validate(req.body, schema);
  return error;
};

