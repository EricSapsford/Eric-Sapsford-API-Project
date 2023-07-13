'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = "Events";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, "venueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Venues",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    })
    await queryInterface.addColumn(options, "groupId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Groupes",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, "venueId")
    await queryInterface.removeColumn(options, "groupId")
  }
};
