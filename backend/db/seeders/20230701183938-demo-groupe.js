'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Groupe } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groupes"
    await Groupe.bulkCreate([
      {
        organizerId: 1,
        name: "Demo Lition's Groupe",
        about: "Couldn't tell you",
        type: "Online",
        private: true,
        city: "Chicago",
        state: "Illinois",
      },
      {
        organizerId: 2,
        name: "User One's Groupe",
        about: "Wish I knew",
        type: "In person",
        private: false,
        city: "New York",
        state: "New York",
      },
      {
        organizerId: 3,
        name: "User Two's Groupe",
        about: "An enigma wrapped in a mystery",
        type: "In person",
        private: true,
        city: "Austin",
        state: "Texas",
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groupes";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Demo Lition's Groupe", "User One's Groupe", "User Two's Groupe"] }
    }, {});
  }
};
