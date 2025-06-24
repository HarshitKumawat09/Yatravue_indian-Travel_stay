const express = require("express");
const router = express.Router();

// ...other routes...

// Landing page route
router.get("/landing", (req, res) => {
  res.render("itinerary/landing");
});

// This must be after other /add POST route!
router.get("/add", (req, res) => {
  // Redirect to landing page first
  res.redirect("/itinerary/landing");
});

// Route for the actual planner
router.get("/comingsoon", (req, res) => {
  res.render("itinerary/comingsoon");
});

// In routes/itinerary.js or similar
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

router.get('/landing', isLoggedIn, (req, res) => {
  // render itinerary landing page
  res.render('itinerary/landing', { user: req.user });
});

module.exports = router;