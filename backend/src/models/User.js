const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  { 
    tableName: "Users",
    freezeTableName: true,
    timestamps: true, // ✅ IMPORTANT for Postgres apps

    hooks: {
      beforeCreate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
      },
      beforeUpdate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
      },
    },
  }
);
User.associate = (models) => {
  User.hasMany(models.Book, { foreignKey: "userId" });
  User.hasMany(models.Course, { foreignKey: "userId" });
  User.hasMany(models.Notification, { foreignKey: "userId" });
  User.hasMany(models.Progress, { foreignKey: "userId" });
};

module.exports = User;