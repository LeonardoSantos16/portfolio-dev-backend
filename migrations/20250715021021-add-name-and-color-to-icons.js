'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Icons', 'name', {
      allowNull: true,
      type: Sequelize.STRING,
    })

    await queryInterface.addColumn('Icons', 'color', {
      allowNull: true,
      type: Sequelize.STRING,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Icons', 'name')
    await queryInterface.removeColumn('Icons', 'color')
  },
}
