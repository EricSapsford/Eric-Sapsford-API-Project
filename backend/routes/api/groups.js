//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();

//============================== END POINTS ==============================
//------- GET ALL GROUPES JOINED OR ORGANIZED BY THE CURRENT USER --------

/* EXISTING ISSUES WITH OUTPUT

- see if "private" needs to be either "true" or "false"
- set models createdAt and updatedAt to grab that date literal thing rather than the default

*/

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req

  let groupes = await Groupe.findAll({
    raw: true,
    include: [{
      model: Membership,
      attributes: [],
      where: {
        userId: user.id
      }
    }],
    attributes: {
      // ^C ^V you sweet sweet siren
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
  })

  //copypaste from get all down there
  //------------------------------------------------------------------
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
  //------------------------------------------------------------------

  res.json({
    //this will ALWAYS feel wrong
    Groups: groupes
  });
})

//--------------------------- GET ALL GROUPES ----------------------------

/* EXISTING ISSUES WITH OUTPUT

- see if "private" needs to be either "true" or "false"
- set models createdAt and updatedAt to grab that date literal thing rather than the default

*/

router.get("/", async (req, res) => {

  let groupes = await Groupe.findAll({
    raw: true,
    include: [{
      model: Membership,
      attributes: []
    }],
    attributes: {
      include: [
        // fuck for loops
        // FUCK WHILE LOOPS
        // sequelize.fn("COUNT", sequelize.col("Memberships.id")), "AS" "numMembers"
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
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
