const mongoose = require("mongoose");
const rideSchema = new mongoose.Schema({
	driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	from: String,
	to: String,
	cost: Number,
	createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Ride", rideSchema);
