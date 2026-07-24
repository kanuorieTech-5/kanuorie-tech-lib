const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Book = sequelize.define("Book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING,
  },
});

Book.associate = (models) => {
  Book.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Book;