const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Course = sequelize.define("Course", {
  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true,
  // },
  resourceId: {
    type: String,
    required: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING, 
    allowNull: true,

  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
    min: 0,
    max: 100,
  },
  },
  lastProgressUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notes: {
  type: DataTypes.TEXT,
  defaultValue: "",
},
});

Course.associate = (models) => {
  Course.belongsTo(models.User, { foreignKey: "userId" });
  Course.hasMany(models.Progress, { foreignKey: "courseId" });
  Course.hasOne(models.Progress, { foreignKey: "courseId" });
};

module.exports = Course;