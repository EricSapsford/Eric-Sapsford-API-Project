'use strict';

const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://imagesite.com/image1",
        preview: true,
      },
      {
        eventId: 2,
        url: "https://imagesite.com/image2",
        preview: false,
      },
      {
        eventId: 3,
        url: "https://imagesite.com/image3",
        preview: true,
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["https://imagesite.com/image1", "https://imagesite.com/image2", "https://imagesite.com/image3"] }
    }, {});
  }
};
