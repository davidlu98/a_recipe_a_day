const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const API_KEY = process.env.SPOONACULAR_API_KEY;

// all routes have prefix /spoonacular

router.get("/daily", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, "LUNA");

    if (!user) {
      return res.status(401).json("Must be logged in to get daily recipe.");
    }

    const userId = user.id;

    // Date range check
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingDish = await prisma.dailyDish.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        id: false,
        userId: false,
        recipeId: false,
        recipe: true,
      },
    });

    if (existingDish) {
      return res.status(200).json(existingDish);
    }

    let newDish = null;
    let tries = 0;
    const MAX_TRIES = 5;

    while (!newDish && tries < MAX_TRIES) {
      tries++;

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=1&sort=random&addRecipeInformation=true`
      );

      const recipe = response.data.results[0];

      const alreadyServed = await prisma.dailyDish.findFirst({
        where: {
          userId,
          recipeId: recipe.id,
        },
      });

      if (alreadyServed) continue;

      console.log("before");

      const fullInfoRes = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
      );

      const fullInfo = fullInfoRes.data;

      console.log("after");

      fullInfo.analyzedInstructions.map((step) => {
        console.log(step);
      });

      const dbRecipe = await prisma.recipe.upsert({
        where: {
          id: fullInfo.id,
        },
        update: {
          title: fullInfo.title,
          image: fullInfo.image,
          readyInMinutes: fullInfo.readyInMinutes,
          servings: fullInfo.servings,
          sourceUrl: fullInfo.sourceUrl,
          vegetarian: fullInfo.vegetarian,
          vegan: fullInfo.vegan,
          glutenFree: fullInfo.glutenFree,
          dairyFree: fullInfo.dairyFree,
          diets: fullInfo.diets,
          dishTypes: fullInfo.dishTypes,
          ingredients:
            fullInfo.extendedIngredients?.map((ing) => ing.original) || [],
          instructions:
            fullInfo.analyzedInstructions?.[0]?.steps?.map(
              (step) => step.step
            ) || [],
        },
        create: {
          id: fullInfo.id,
          title: fullInfo.title,
          image: fullInfo.image,
          readyInMinutes: fullInfo.readyInMinutes,
          servings: fullInfo.servings,
          sourceUrl: fullInfo.sourceUrl,
          vegetarian: fullInfo.vegetarian,
          vegan: fullInfo.vegan,
          glutenFree: fullInfo.glutenFree,
          dairyFree: fullInfo.dairyFree,
          diets: fullInfo.diets,
          dishTypes: fullInfo.dishTypes,
          ingredients:
            fullInfo.extendedIngredients?.map((ing) => ing.original) || [],
          instructions:
            fullInfo.analyzedInstructions?.[0]?.steps?.map(
              (step) => step.step
            ) || [],
        },
      });

      newDish = await prisma.dailyDish.create({
        data: {
          userId,
          recipeId: dbRecipe.id,
          date: startOfDay,
        },
        include: {
          recipe: true,
        },
      });
    }

    if (!newDish) {
      return res
        .status(500)
        .json("Could not generate a new dish. Try again later.");
    }

    return res.status(200).json(newDish);
  } catch (error) {
    console.error("Error in /daily:", error);
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
