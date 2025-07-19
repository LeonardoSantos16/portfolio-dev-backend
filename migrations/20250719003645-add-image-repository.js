'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Repositories', 'image_url', {
      type: Sequelize.STRING,
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Repositories', 'image_url')
  },
}
