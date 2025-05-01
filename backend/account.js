const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /account

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });

      // if (dbUser.banned) {
      //   return res.status(403).json("This account has been banned.");
      // }

      return res.send(dbUser);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
