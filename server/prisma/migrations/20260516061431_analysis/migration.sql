-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "viralScore" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "engagement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
