// index.js is the entry point for the application. It sets up the server and routes.

const express = require("express");
const session = require("express-session");
const passport = require("./services/authService"); // Update the path to where your passport config is actually located
const path = require("path");
const createError = require("http-errors");
require("dotenv").config(); // Load environment variables from a .env file into process.env

const flash = require("connect-flash");
// const bodyParser = require("body-parser");

const app = express();

// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a .env variable for the secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash()); // Initialize flash messages

// Body parsers for JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, "public")));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import route handlers
const homeRoutes = require("./routes/home");
const userLoginRoutes = require("./routes/userlogin");
const adminLoginRoutes = require("./routes/adminlogin");
const resortsRoutes = require("./routes/resorts");
const registerRoutes = require("./routes/register");

app.use("/register", registerRoutes); // Add this line to use the register routes

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use routes
app.use("/", homeRoutes);
// app.use("/adminlogin", adminLoginRoutes);
app.use("/userlogin", userLoginRoutes);
app.use("/resorts", resortsRoutes);
app.use("/register", registerRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error", { error: err }); // Make sure to pass the error object with the key 'error'
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
