const express = require("express");
const router = express.Router();

// ...other routes...

// This must be after other /add POST route!
router.get("/add", (req, res) => {
  res.render("itinerary/comingsoon");
});

module.exports = router;