if (process.env.NODE_ENV !== "production") {
require('dotenv').config();
}
// console.log(process.env)


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const MONGO_URL = ("mongodb://127.0.0.1:27017/wanderlust");
const Reviews = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { expression } = require("joi");

const itineraryRouter = require("./routes/itinerary");
app.use("/itinerary", itineraryRouter);


main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "this is a secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
};    


// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     });
//     let registeredUser = await User.register(fakeUser, "Hello Namaste");
//     res.send(registeredUser);
// });

// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(400, msg)
//     } else {
//         next();
//     }
// };

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(400, msg)
//     } else {
//         next();
//     }
// };

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// //Index route..
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// });

// //new route..
// app.get("/listings/new", (req, res) => {
//    res.render("listings/new.ejs"); 
// });

// //show route...
// app.get("/listings/:id", async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// });

// //create route..
// app.post("/listings", wrapAsync(async (req, res, next) => {
//     // let listing = req.body.listing;
//     // console.log(listing);listingSchema.validate(req.body);
//         // console.log(result);
        
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     // }catch(err){
//     //     next(err);
//     // } 
// }));

// //Edit route..
// app.get("/listings/:id/edit", async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// });

// //update route
// app.put("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   });

//   //Delete Route
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   });

//   //Reviews
//   //Post route
//   app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Reviews(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     // console.log( "new review saved");
//     // res.send("new review saved")
//     res.redirect(`/listings/${listing._id}`);
//     }));


//     //Delete route
//     app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//         let { id, reviewId } = req.params;
//         await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//         await Reviews.findByIdAndDelete(reviewId);
//         res.redirect(`/listings/${id}`);
//       }));

// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 120,
//     location: "Calangute, Goa" ,
//     country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
app.get('/about', (req, res) => res.render('static/about'));
app.get('/support', (req, res) => res.render('static/support'));
app.get('/faqs', (req, res) => res.render('static/faqs'));
app.get('/privacy', (req, res) => res.render('static/privacy'));
app.get('/terms', (req, res) => res.render('static/terms'));
app.get('/why-host', (req, res) => res.render('static/why-host'));
app.get('/host-support', (req, res) => res.render('static/host-support'));
app.get('/host-faqs', (req, res) => res.render('static/host-faqs'));

app.all("*",(req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let{statusCode, message} = err;
    res.render("error.ejs", { message });
    // res.status(statusCode).send(message);
});
   

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});