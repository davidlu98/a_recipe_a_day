require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

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

app.use("/register", register);
app.use("/account", account);
app.use("/login", login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
