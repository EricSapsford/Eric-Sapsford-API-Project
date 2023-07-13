'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Venue } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Venues";
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "123",
        city: "Chicago",
        state: "Illinois",
        lat: 41.8781,
        lng: 87.6298,
      },
      {
        groupId: 2,
        address: "456",
        city: "New York",
        state: "New York",
        lat: 40.7128,
        lng: 74.0060,
      },
      {
        groupId: 3,
        address: "789",
        city: "Austin",
        state: "Texas",
        lat: 30.2672,
        lng: 97.7431,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["123", "456", "789"] }
    }, {});
  }
};
