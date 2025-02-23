'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RepositoryIcons', {
      repositoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Repositories',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },

      iconId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Icons',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RepositoryIcons')
  }
};
