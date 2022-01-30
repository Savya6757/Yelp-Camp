const express = require("express");
const app = express();
const path = require("path");
const ejsMethod = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const campgroundRouter = require("./routes/campground");
const reviewsRouter = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((e) => {
    console.log("Mongo Error");
    console.log(e);
  });

app.engine("ejs", ejsMethod);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oops Something Went Wrong";
  }
  res.status(statusCode).render("error", {
    err,
  });
});

app.listen(3000, () => {
  console.log("Listening to port 3000 !!");
});
