const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
// const attendanceRouter = require("./attendance.js");
// const eventsRouter = require("./events.js");
const groupsRouter = require("./groups.js");
// const membersRouter = require("./members.js");
// const venuesRouter = require("./venues.js");
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use(restoreUser);

//============================== ROUTERS ==============================
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
// router.use("/attendance", attendanceRouter);
// router.use("/events", eventsRouter);
router.use("/groups", groupsRouter);
// router.use("/members", membersRouter);
// router.use("/venues", venuesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
