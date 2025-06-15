"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Repositories", "category", {
      type: Sequelize.ENUM(
        "WEB_DEVELOPMENT",
        "MOBILE_DEVELOPMENT",
        "BACKEND_SYSTEMS",
        "DATA_SCIENCE",
        "FULL_STACK"
      ),
      allowNull: true,
    }),
      await queryInterface.addColumn("Repositories", "highlighted", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Repositories", "category");
    await queryInterface.removeColumn("Repositories", "highlighted");
  },
};
