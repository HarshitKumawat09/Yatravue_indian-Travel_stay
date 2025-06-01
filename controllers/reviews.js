const Listing = require("../models/listing");
const Reviews = require("../models/review");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id; // Set the author to the logged-in user
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log( "new review saved");
    // res.send("new review saved")
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully deleted the review!");
        res.redirect(`/listings/${id}`);
};

