/*
  Warnings:

  - You are about to drop the column `endTime` on the `Cuts` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Cuts` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Cuts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Videos` table. All the data in the column will be lost.
  - Added the required column `bucketPath` to the `Cuts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Cuts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuts" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "url",
ADD COLUMN     "bucketPath" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "title",
ADD COLUMN     "status" TEXT NOT NULL;
