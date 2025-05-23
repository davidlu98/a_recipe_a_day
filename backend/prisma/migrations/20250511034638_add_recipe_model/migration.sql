-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "readyInMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "vegetarian" BOOLEAN NOT NULL,
    "vegan" BOOLEAN NOT NULL,
    "glutenFree" BOOLEAN NOT NULL,
    "dairyFree" BOOLEAN NOT NULL,
    "diets" TEXT[],
    "dishTypes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
