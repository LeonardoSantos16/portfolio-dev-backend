'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('RepositoryIcons', 'repositoryId', {
      primaryKey: true,
    })

    await queryInterface.changeColumn('RepositoryIcons', 'iconId', {
      primaryKey: true,
    })
  },

  async down (queryInterface, Sequelize) {
  
  }
};
