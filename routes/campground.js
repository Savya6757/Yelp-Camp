const express = require("express");
const router = express.Router();
const { catchAsync } = require("../utils/catchAsync");
const { isLoggedIn, campgroundValidation, isOwner, fileCheck } = require("../middleware");
const campgrounds = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    fileCheck,
    campgroundValidation,
    catchAsync(campgrounds.createNewCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isOwner,
    upload.array("image"),
    fileCheck,
    campgroundValidation,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm));

module.exports = router;
