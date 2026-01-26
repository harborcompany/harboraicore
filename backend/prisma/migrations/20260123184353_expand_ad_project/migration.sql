/*
  Warnings:

  - Added the required column `clientId` to the `AdProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdProject" ADD COLUMN     "brandGuidelines" JSONB,
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "goals" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "targetAudience" JSONB;

-- CreateTable
CREATE TABLE "ProjectAsset" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "metadata" JSONB,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectAsset" ADD CONSTRAINT "ProjectAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "AdProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
