// routes/rides.js (updated to show booking success details on separate page)
const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
const User = require("../models/User");

function requireLogin(req, res, next) {
	if (!req.session.user) return res.redirect("/login");
	next();
}

function isDriver(req, res, next) {
	if (req.session.user.role !== "driver")
		return res.redirect("/rides/dashboard");
	next();
}

router.get("/post", requireLogin, isDriver, (req, res) => {
	res.render("driver_post");
});

router.post("/post", requireLogin, isDriver, async (req, res) => {
	const { from, to, cost } = req.body;
	await new Ride({ driver: req.session.user._id, from, to, cost }).save();
	res.redirect("/rides/post");
});

router.get("/dashboard", requireLogin, async (req, res) => {
	const rides = await Ride.find({}).populate("driver");
	res.render("user_dashboard", { rides });
});

router.get("/all-rides", requireLogin, async (req, res) => {
	const rides = await Ride.find({ driver: req.session.user._id }).populate(
		"driver"
	);
	res.render("driver_all_rides", { rides });
});

router.post("/book/:rideId", requireLogin, async (req, res) => {
	const ride = await Ride.findByIdAndDelete(req.params.rideId).populate(
		"driver"
	);
	if (!ride) return res.status(404).send("Ride not found");

	res.render("booking_success", {
		from: ride.from,
		to: ride.to,
		cost: ride.cost,
		driver: ride.driver.username || "Driver",
	});
});

module.exports = router;
