require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

const register = require("./register");
const account = require("./account");
const login = require("./login");
const spoonacular = require("./spoonacular");
const journal = require("./journal");

app.use("/register", register);
app.use("/account", account);
app.use("/login", login);
app.use("/spoonacular", spoonacular);
app.use("/journal", journal);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
