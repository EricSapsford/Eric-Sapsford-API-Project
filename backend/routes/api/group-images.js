//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();


//=============================== END POINTS ===============================

//----------------------- DELETE AN IMAGE FOR A GROUP ----------------------
//----------------------- DELETE AN IMAGE FOR A GROUP ----------------------
//----------------------- DELETE AN IMAGE FOR A GROUP ----------------------
//----------------------- DELETE AN IMAGE FOR A GROUP ----------------------

router.delete("/:imageId", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const imageId = req.params.imageId;

  const image = await GroupImage.findByPk(imageId);

  if (!image) {
    res.status(404);
    return res.json({
      "message": "Group Image couldn't be found"
    })
  }

  let organToken = false;
  const currUserIsOrgan = await User.findOne({
    include: [
      {
        model: Groupe,
        where: {
          organizerId: userId,
          id: image.groupId
        }
      },
    ]
  })

  if (currUserIsOrgan) organToken = true;


  let cohostToken = false;
  const currUserIsCohost = await User.findOne({
    include: [
      {
        model: Groupe,
        where: {
          id: image.groupId
        }
      },
      {
        model: Membership,
        where: {
          userId: userId,
          status: "co-host"
        }
      }
    ]
  })

  if (currUserIsCohost) cohostToken = true;

  if (organToken || cohostToken) {
    await image.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
  } else {
    res.status(403);
    return res.json({
      "message": "You there buckeroo don't have the authorization for that"
    })
  }
})


module.exports = router;
