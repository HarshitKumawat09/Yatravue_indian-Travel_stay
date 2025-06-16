const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
};

// Helper function (top of file or before routes)
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}

// POST /listings (Create Listing)
router.post('/listings', async (req, res) => {
  const coords = await geocodeAddress(req.body.location);
  const newListing = new Listing({
    ...req.body,
    latitude: coords ? coords.lat : undefined,
    longitude: coords ? coords.lon : undefined
  });
  await newListing.save();
  res.redirect(`/listings/${newListing._id}`);
});

// PUT /listings/:id (Update Listing)
router.put('/listings/:id', async (req, res) => {
  const coords = await geocodeAddress(req.body.location);
  await Listing.findByIdAndUpdate(req.params.id, {
    ...req.body,
    latitude: coords ? coords.lat : undefined,
    longitude: coords ? coords.lon : undefined
  });
  res.redirect(`/listings/${req.params.id}`);
});

//Index route..
router.get("/", wrapAsync(listingController.index));



//new route..
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route...
router.get("/:id", wrapAsync(listingController.showListing)
);

//create route..
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
   

//Edit route..
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)
);

//update route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)
);

  //Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);

  module.exports = router;
