//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();

//__________________________________ validator __________________________________

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Latitude is required"),
  check("lng")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Longitude is required"),
  check("lat")
    //shame I can't use isLatLong()
    .exists({ checkFalsy: true })
    .isFloat({ min: -90.0000000, max: 90.0000000 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180.0000000, max: 180.0000000 })
    .withMessage("Longitude is not valid"),
  handleValidationErrors
];

//=============================== END POINTS ===============================

//--------------------- EDIT A VENUE SPECIFIED BY ITS ID ------------------------
//--------------------- EDIT A VENUE SPECIFIED BY ITS ID ------------------------
//--------------------- EDIT A VENUE SPECIFIED BY ITS ID ------------------------
//--------------------- EDIT A VENUE SPECIFIED BY ITS ID ------------------------

router.put("/:venueId", requireAuth, validateVenue, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const { address, city, state, lat, lng } = req.body

  const userId = user.dataValues.id;
  const venueId = req.params.venueId;

  let venue = await Venue.findByPk(venueId);

  if (!venue) {
    res.status(404);
    return res.json({
      "message": "Venue couldn't be found"
    })
  }

  let venueGroupe = await Groupe.findByPk(venue.groupId)

  let userMembership = await Membership.findOne({
    where: {
      groupId: venue.groupId,
      userId
    }
  });

  console.log(userMembership);

  if (!userMembership) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  // LET
  // THAT
  // DOG
  // OUT

  let dog = 0;
  if (userId === venueGroupe.organizerId) dog++;
  console.log(dog);
  if (userMembership.status === "co-host") dog++;
  console.log(dog);
  if (dog === 0) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  venue.address = address;
  venue.city = city;
  venue.state = state;
  venue.lat = lat;
  venue.lng = lng;
  await venue.save();

  let findVenue = await Venue.findByPk(venueId, {
    attributes: [
      "id",
      "groupId",
      "address",
      "city",
      "state",
      "lat",
      "lng"
    ]
  })
  res.status(200)
  return res.json(findVenue);
})



module.exports = router;
