const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose
	.connect("mongodb://localhost/rideDB")
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files (images, css)
app.use(express.static(path.join(__dirname, "public")));

// Set views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: "mongodb://localhost/rideDB" }),
	})
);

// Make user available in all views
app.use((req, res, next) => {
	res.locals.currentUser = req.session.user;
	next();
});

// Routes
const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/rides");

app.use("/", authRoutes);
app.use("/rides", rideRoutes);

// Home Page
app.get("/", (req, res) => {
	res.render("index");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
