const { body } = require("express-validator");

const createTeamValidator = [

body("firstName")
.notEmpty()
.withMessage("First name is required."),

body("lastName")
.notEmpty()
.withMessage("Last name is required."),

body("position")
.notEmpty()
.withMessage("Position is required."),

body("email")
.optional()
.isEmail()
.withMessage("Invalid email address."),

body("image")
.optional()
.isURL()
.withMessage("Image must be a valid URL."),

body("featured")
.optional()
.isBoolean(),

body("active")
.optional()
.isBoolean(),

body("order")
.optional()
.isNumeric(),

];

const updateTeamValidator = [

body("firstName").optional(),

body("lastName").optional(),

body("position").optional(),

body("email")
.optional()
.isEmail(),

body("image")
.optional()
.isURL(),

];

module.exports = {

createTeamValidator,

updateTeamValidator,

};