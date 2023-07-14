//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();

//============================== END POINTS ==============================
//--------------------------- GET ALL GROUPES ----------------------------


router.get("/", async (req, res) => {

  let groupes = await Groupe.findAll({
    raw: true,
    include: [{
      model: Membership,
      attributes: []
    }],
    attributes: {
      include: [
        // sequelize.fn("COUNT", sequelize.col("Memberships.id")), "AS" "numMembers"
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
    group: ["Groupe.id"]
  });

  // THEY SAY WE LAZY LOAD WE LAZY LOAD

  for (let index = 0; index < groupes.length; index++) {
    // let image = await Groupe.findall(
    let image = await Groupe.findByPk(groupes[index].id, {
      raw: true,
      include: [{
        model: GroupImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    groupes[index].numMembers = Number(groupes[index].numMembers);

    if (image) {
      groupes[index].previewImage = image["GroupImages.url"];
    } else {
      groupes[index].previewImage = "preview does not exist";
    };
  }

  res.json({
    //this feels wrong
    Groups: groupes
  });

})

module.exports = router;
