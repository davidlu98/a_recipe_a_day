const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /login

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json("Invalid username or password.");
    } else {
      if (user.banned) {
        return res.status(403).json("This account has been banned.");
      }

      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (isCorrectPassword) {
        const token = jwt.sign(user, "LUNA");
        res.send(token);
      } else {
        return res.status(401).json("Invalid username or password.");
      }
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
