/*
  Warnings:

  - You are about to drop the column `image` on the `DailyDish` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `DailyDish` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `DailyDish` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `DailyDish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyDish" DROP COLUMN "image",
DROP COLUMN "ingredients",
DROP COLUMN "instructions",
DROP COLUMN "title";

-- AddForeignKey
ALTER TABLE "DailyDish" ADD CONSTRAINT "DailyDish_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
