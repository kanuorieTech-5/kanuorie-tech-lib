const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Progress = sequelize.define("Progress", {
  Progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },

  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  lastProgressUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },

  // OPTIONAL: for books (won’t break anything if unused)
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  courseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// ✅ Associations
Progress.associate = (models) => {
  Progress.belongsTo(models.User, { foreignKey: "userId" });

  Progress.belongsTo(models.Course, {
    foreignKey: "courseId",
    allowNull: true,
  });

  // OPTIONAL (safe)
  Progress.belongsTo(models.Book, {
    foreignKey: "bookId",
    allowNull: true,
  });
};

module.exports = Progress;