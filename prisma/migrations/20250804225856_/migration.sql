/*
  Warnings:

  - Added the required column `url` to the `Cuts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuts" ADD COLUMN     "url" TEXT NOT NULL;
