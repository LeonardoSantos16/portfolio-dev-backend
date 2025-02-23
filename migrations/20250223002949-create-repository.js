'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Repositories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      icon: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      link_demo: {
        type: Sequelize.STRING,
        allowNull: true
      },
       link_github: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Repositories')
  }
};
