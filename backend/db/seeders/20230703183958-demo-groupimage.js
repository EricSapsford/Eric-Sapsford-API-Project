'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://imagesite.com/group1",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://imagesite.com/group2",
        preview: false,
      },
      {
        groupId: 3,
        url: "https://imagesite.com/group3",
        preview: false,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["https://imagesite.com/group1", "https://imagesite.com/group2", "https://imagesite.com/group3"] }
    }, {});
  }
};
