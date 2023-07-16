'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Deferrable } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = "Groupes";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, "organizerId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      hooks: true
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, "organizerId")
  }
};
