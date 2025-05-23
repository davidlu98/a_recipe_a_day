const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const multer = require("multer");

const API_KEY = process.env.SPOONACULAR_API_KEY;

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save to /uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// all routes have prefix /spoonacular

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, "LUNA");

    if (!user) {
      return res.status(401).json("Must be logged in to get daily recipe.");
    }

    const userId = user.id;

    const dailyDishes = await prisma.dailyDish.findMany({
      where: {
        userId,
      },
      include: {
        recipe: true,
      },
    });

    return res.status(200).json(dailyDishes);
  } catch (error) {
    console.error("Error in /daily:", error);
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

router.get("/:startOfMonth/:endOfMonth", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, "LUNA");

    if (!user) {
      return res.status(401).json("Must be logged in to get daily recipe.");
    }

    const userId = user.id;

    const dailyDishes = await prisma.dailyDish.findMany({
      where: {
        userId,
        date: {
          gte: req.params.startOfMonth,
          lte: req.params.endOfMonth,
        },
      },
      include: {
        recipe: true,
        journal: true,
      },
    });

    return res.status(200).json(dailyDishes);
  } catch (error) {
    console.error("Error in /journal/:startOfMonth/:endOfMonth", error);
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

router.post("/:dailyDishId/", upload.single("image"), async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, "LUNA");

    if (!user) {
      return res.status(401).json("Must be logged in to edit journal.");
    }

    const userId = user.id;

    // console.log("server daily dish id:", req.params.dailyDishId);
    // console.log("server comment:", req.body.comment);

    const existingDish = await prisma.dailyDish.findUnique({
      where: {
        userId,
        id: req.params.dailyDishId,
      },
    });

    if (!existingDish) {
      return res
        .status(403)
        .json("You do not have permission to edit this journal.");
    }

    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) {
      await prisma.journalEntry.upsert({
        where: {
          dailyDishId: req.params.dailyDishId,
        },
        update: {
          notes: req.body.comment,
        },
        create: {
          dailyDishId: req.params.dailyDishId,
          notes: req.body.comment,
        },
      });
    } else {
      await prisma.journalEntry.upsert({
        where: {
          dailyDishId: req.params.dailyDishId,
        },
        update: {
          notes: req.body.comment,
          imageUrl,
        },
        create: {
          dailyDishId: req.params.dailyDishId,
          notes: req.body.comment,
          imageUrl,
        },
      });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error in /journal/:journalId", error);
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
