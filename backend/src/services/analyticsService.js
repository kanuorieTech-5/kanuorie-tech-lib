const User = require("../models/User");
const Learning = require("../models/Learning");
const Course = require("../models/Course");
const Product = require("../models/Product");

exports.dashboard = async () => {
  const [
    users,
    books,
    courses,
    products,
  ] = await Promise.all([
    User.countDocuments(),

    Learning.countDocuments(),

    Course.countDocuments(),

    Product.countDocuments(),
  ]);

  return {
    users,
    books,
    courses,
    products,
  };
};