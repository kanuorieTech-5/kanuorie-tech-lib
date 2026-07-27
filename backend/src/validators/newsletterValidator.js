const { body } = require("express-validator");

const subscribeValidator = [

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),

];

module.exports = {
  subscribeValidator,
};