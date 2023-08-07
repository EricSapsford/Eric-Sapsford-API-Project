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
        name: "Holiday Hunters",
        about: "We LIVE for the holidays, specifically holiday dinners. Are you in the Chicago area? Invite us to your Thanksgiving or Christmas dinner. C'mon it'd be fun. Do it! Do it.",
        type: "Online",
        private: true,
        city: "Chicago",
        state: "IL",
      },
      {
        organizerId: 2,
        name: "Wedding Crashers",
        about: "Do you LOVE wedding dinners, but just can't seem to get invited to enough weddings to enojoy them? Come with us as we find increasingly illegal methods to gain access to those tasty wedding spreads!",
        type: "In person",
        private: false,
        city: "New York",
        state: "NY",
      },
      {
        organizerId: 3,
        name: "Metropolis Munchers",
        about: "It's a busy world out there and sometimes all you've got time for is a snack under you local overpass. We're you're best resource for all the best overpases and juiciest dumpsters in the Milwaukee area.",
        type: "In person",
        private: true,
        city: "Milwaukee",
        state: "WI",
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
