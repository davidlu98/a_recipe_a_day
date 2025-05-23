-- DropIndex
DROP INDEX "User_password_key";

-- CreateTable
CREATE TABLE "DailyDish" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "instructions" TEXT,

    CONSTRAINT "DailyDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "dailyDishId" TEXT NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyDish_userId_recipeId_key" ON "DailyDish"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDish_userId_date_key" ON "DailyDish"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_dailyDishId_key" ON "JournalEntry"("dailyDishId");

-- AddForeignKey
ALTER TABLE "DailyDish" ADD CONSTRAINT "DailyDish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_dailyDishId_fkey" FOREIGN KEY ("dailyDishId") REFERENCES "DailyDish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
