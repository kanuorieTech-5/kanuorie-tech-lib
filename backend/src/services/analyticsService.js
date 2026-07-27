exports.dashboard = async()=>{

const [

users,

books,

courses,

products,

] = await Promise.all([

User.countDocuments(),

Book.countDocuments(),

Course.countDocuments(),

Product.countDocuments(),

]);

return{

users,

books,

courses,

products,

};

};