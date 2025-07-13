'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Repositories', 'short_description', {
      allowNull: true,
      type: Sequelize.STRING(130),
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Repositories', 'short_description')
  },
}
