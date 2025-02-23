// models/repository.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Repository = sequelize.define('Repository', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    link_demo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
        type: Sequelize.Date,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE
    }
  });

  return Repository;
};
