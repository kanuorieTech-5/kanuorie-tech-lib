exports.getHomepage = async()=>{

const [

services,

projects,

books,

courses,

blogs,

testimonials,

faq,

] = await Promise.all([

Service.find({featured:true}),

Project.find({featured:true}),

Book.find({featured:true}),

Course.find({featured:true}),

Blog.find().limit(3),

Testimonial.find(),

FAQ.find(),

]);

return{

services,

projects,

books,

courses,

blogs,

testimonials,

faq,

};

};