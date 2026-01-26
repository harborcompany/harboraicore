/*
  Warnings:

  - You are about to drop the column `brandGuidelines` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `currentStep` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `platforms` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `targetAudience` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `AdProject` table. All the data in the column will be lost.
  - You are about to drop the column `itemCount` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the `Annotation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetAnnotation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IngestionJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DatasetToLicense` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `goal` to the `AdProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `AdProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `AdProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaType` to the `Dataset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('MOBILE', 'GLASSES', 'TV', 'API');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('ADMIN', 'ANALYST', 'CREATIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'CONTRIBUTOR';
ALTER TYPE "UserRole" ADD VALUE 'ENTERPRISE';

-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "AssetAnnotation" DROP CONSTRAINT "AssetAnnotation_assetId_fkey";

-- DropForeignKey
ALTER TABLE "MediaAsset" DROP CONSTRAINT "MediaAsset_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAsset" DROP CONSTRAINT "ProjectAsset_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_DatasetToLicense" DROP CONSTRAINT "_DatasetToLicense_A_fkey";

-- DropForeignKey
ALTER TABLE "_DatasetToLicense" DROP CONSTRAINT "_DatasetToLicense_B_fkey";

-- AlterTable
ALTER TABLE "AdProject" DROP COLUMN "brandGuidelines",
DROP COLUMN "clientId",
DROP COLUMN "currentStep",
DROP COLUMN "goals",
DROP COLUMN "platforms",
DROP COLUMN "targetAudience",
DROP COLUMN "thumbnail",
ADD COLUMN     "goal" TEXT NOT NULL,
ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "platform" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "itemCount",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "annotationSchema" JSONB,
ADD COLUMN     "licenseTerms" TEXT,
ADD COLUMN     "mediaType" TEXT NOT NULL,
ADD COLUMN     "ragEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MediaAsset" DROP COLUMN "url",
ADD COLUMN     "checksum" TEXT,
ADD COLUMN     "resolution" TEXT,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "storagePointer" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "datasetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kycStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "walletId" TEXT;

-- DropTable
DROP TABLE "Annotation";

-- DropTable
DROP TABLE "AssetAnnotation";

-- DropTable
DROP TABLE "IngestionJob";

-- DropTable
DROP TABLE "License";

-- DropTable
DROP TABLE "ProjectAsset";

-- DropTable
DROP TABLE "_DatasetToLicense";

-- DropEnum
DROP TYPE "AdStep";

-- DropEnum
DROP TYPE "DatasetStatus";

-- DropEnum
DROP TYPE "DatasetType";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "LicenseType";

-- DropEnum
DROP TYPE "TaskPriority";

-- CreateTable
CREATE TABLE "CaptureSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL DEFAULT 'MOBILE',
    "deviceId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaptureSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "usageScope" JSONB NOT NULL,
    "revSharePct" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnnotation" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "labelType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT,
    "eventType" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "billingPlan" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'ANALYST',

    CONSTRAINT "OrgUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetAccess" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DatasetAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetBuild" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "sourceAssets" JSONB NOT NULL,
    "filters" JSONB,
    "ragRules" JSONB,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatasetBuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdGenerationRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "outputAssets" JSONB,
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdGenerationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APICredential" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "rateLimit" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "APICredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "cost" DECIMAL(10,4) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "period" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsentRecord_mediaId_key" ON "ConsentRecord"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "APICredential_apiKey_key" ON "APICredential"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletId_key" ON "User"("walletId");

-- AddForeignKey
ALTER TABLE "CaptureSession" ADD CONSTRAINT "CaptureSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CaptureSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnotation" ADD CONSTRAINT "UserAnnotation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnotation" ADD CONSTRAINT "UserAnnotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsLedger" ADD CONSTRAINT "EarningsLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsLedger" ADD CONSTRAINT "EarningsLedger_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccess" ADD CONSTRAINT "DatasetAccess_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccess" ADD CONSTRAINT "DatasetAccess_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetBuild" ADD CONSTRAINT "DatasetBuild_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdProject" ADD CONSTRAINT "AdProject_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdGenerationRun" ADD CONSTRAINT "AdGenerationRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "AdProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APICredential" ADD CONSTRAINT "APICredential_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
