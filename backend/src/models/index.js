const { sequelize } = require("../config/db");

// Import models
const User = require("./User");
const Book = require("./Book");
const Course = require("./Course");
const Notification = require("./Notification");
const Progress = require("./Progress");

// Create db object
const db = {};

db.sequelize = sequelize;

db.User = User;
db.Book = Book;
db.Course = Course;
db.Notification = Notification;
db.Progress = Progress;

/* =========================
   🔗 RELATIONSHIPS
========================= */

// 👤 USER RELATIONS
db.User.hasMany(db.Course, { foreignKey: "userId" });
db.Course.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Book, { foreignKey: "userId" });
db.Book.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Notification, { foreignKey: "userId" });
db.Notification.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Progress, { foreignKey: "userId" });
db.Progress.belongsTo(db.User, { foreignKey: "userId" });

// 📚 COURSE RELATIONS
db.Course.hasOne(db.Progress, { foreignKey: "courseId" });
db.Progress.belongsTo(db.Course, { foreignKey: "courseId" });

// 📖 BOOK RELATIONS (optional but future-ready)
db.Book.hasOne(db.Progress, { foreignKey: "bookId" });
db.Progress.belongsTo(db.Book, { foreignKey: "bookId" });

/* =========================
   AUTO LOAD MODEL ASSOCIATIONS
========================= */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;