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
    group: ["Groupe.id"]
  })

  //copypaste from get all down there
  //_____________________________________________________
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
  //_____________________________________________________

  res.json({
    //this will ALWAYS feel wrong
    Groups: groupes
  });
})



//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------

router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;

  // Groupe base
  let groupe = await Groupe.findByPk(groupId, {
    // raw: true;
    include: [{
      model: Membership,
      attributes: [],
      // where: { <-- because why the fuck would I need this?
      //   userId: user.id
      // }
    }],
    attributes: {
      // ^C ^V you sweet sweet succulent siren
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
    group: ["Groupe.id"]
  })

  // Error Handler start, gross I know
  if (groupe) {
    groupe = groupe.toJSON(); //<-- can't have this outside of the if for reasons

    //Organizer
    let organizer = await User.findByPk(groupe.organizerId, {
      attributes: ["id", "firstName", "lastName"]
    })

    //Venue
    let venue = await Venue.findAll({
      attributes: [
        "id",
        "groupId",
        "address",
        "city",
        "state",
        "lat",
        "lng"
      ],
      where: {
        groupId
      }
    })

    //GroupImages
    let groupImages = await GroupImage.findAll({
      attributes: [
        "id",
        "url",
        "preview"
      ],
      where: {
        groupId: req.params.groupId
      }
    })

    //Compile
    groupe.GroupImages = groupImages;
    groupe.Organizer = organizer;
    groupe.Venues = venue;


    // if (groupe) {
    res.json({
      ...groupe
    });
  } else {
    res.status(404);
    res.json({
      "message": "Groupe couldn't be found"
    })
  }
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
    //Groupe.id <-- you dumb fuck
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
