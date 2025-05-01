const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

// all routes have prefix /register

const badWords = fs
  .readFileSync(path.join(__dirname, "badwords.txt"), "utf8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0);

const leetMap = {
  a: "[a24]",
  e: "[e3]",
  i: "[i1!]",
  o: "[o0]",
  s: "[s5]",
  t: "[t7]",
  b: "[b8]",
  g: "[g9]",
  z: "[z2]",
};

function buildLeetRegex(word) {
  const pattern = word
    .toLowerCase()
    .split("")
    .map((char) => leetMap[char] || char)
    .join("");
  return new RegExp(pattern, "gi"); // global + case-insensitive
}

const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

function isCleanUsername(username, badWords) {
  const lowerUsername = username.toLowerCase();

  for (const word of badWords) {
    const regex = buildLeetRegex(word);
    if (regex.test(lowerUsername)) {
      return false;
    }
  }

  return true;
}

router.post("/", async (req, res, next) => {
  try {
    const { username, password, confirmedPassword } = req.body;

    if (username.length < 4 || username.length > 12) {
      return res
        .status(400)
        .json("Username must be between 4 and 12 characters.");
    }

    if (username !== username.trim()) {
      return res
        .status(400)
        .json("Username cannot have leading or trailing spaces.");
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res
        .status(400)
        .json("Username can only contain letters and numbers.");
    }

    const matches = matcher.getAllMatches(username);
    const hasMatches = matches.length > 0;

    if (hasMatches) {
      return res.status(400).json("Username is inappropriate.");
    }

    if (!isCleanUsername(username, badWords)) {
      return res.status(400).json("Username is inappropriate.");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json("Password must be at least 6 characters long.");
    }

    if (password.length > 255) {
      return res
        .status(400)
        .json("Password must be less than 255 characters long.");
    }

    if (password !== confirmedPassword) {
      return res.status(400).json("Passwords are not the same.");
    }

    if (password !== password.trim()) {
      return res
        .status(400)
        .json("Password cannot have leading or trailing spaces.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(newUser, "LUNA");
    return res.send(token);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json("Username is already taken.");
      }
      if (error.code === "P2000") {
        return res.status(400).json("Input is too long. Please shorten it.");
      }
    }

    console.error(error); // This is useful for debugging unknown issues!
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
