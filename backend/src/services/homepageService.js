const Service = require("../models/Service");
const Project = require("../models/Project");
const Learning = require("../models/Learning");
const Course = require("../models/Course");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const FAQ = require("../models/FAQ");

exports.getHomepage = async () => {
  const [
    services,
    projects,
    books,
    courses,
    blogs,
    testimonials,
    faq,
  ] = await Promise.all([
    Service.find({ featured: true }),

    Project.find({ featured: true }),

    Learning.find({ featured: true }),

    Course.find({ featured: true }),

    Blog.find().limit(3),

    Testimonial.find(),

    FAQ.find(),
  ]);

  return {
    services,
    projects,
    books,
    courses,
    blogs,
    testimonials,
    faq,
  };
};