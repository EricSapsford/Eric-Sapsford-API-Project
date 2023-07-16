'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Deferrable } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = "Attendances";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, "eventId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Events",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED
      },
      onDelete: "CASCADE",
      hooks: true
    })
    await queryInterface.addColumn(options, "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED
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
    await queryInterface.removeColumn(options, "eventId")
    await queryInterface.removeColumn(options, "userId")
  }
};
