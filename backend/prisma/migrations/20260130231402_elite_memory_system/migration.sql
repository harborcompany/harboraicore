-- CreateEnum
CREATE TYPE "DatasetVertical" AS ENUM ('AUTOMOTIVE', 'BROADCAST', 'GAMING', 'THERAPY', 'RETAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "DatasetStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('COMMERCIAL', 'RESEARCH', 'HYBRID');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('USAGE', 'SUBSCRIPTION', 'EXCLUSIVE');

-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "annotationTypes" TEXT[],
ADD COLUMN     "benchmarkResults" JSONB,
ADD COLUMN     "datasetStatus" "DatasetStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "governanceProfileId" TEXT,
ADD COLUMN     "intendedUseCases" TEXT[],
ADD COLUMN     "isAnchor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseType" "LicenseType" NOT NULL DEFAULT 'COMMERCIAL',
ADD COLUMN     "modalities" TEXT[],
ADD COLUMN     "modelReadinessScore" DOUBLE PRECISION,
ADD COLUMN     "pricingModel" "PricingModel" NOT NULL DEFAULT 'USAGE',
ADD COLUMN     "qualityProfileId" TEXT,
ADD COLUMN     "totalHours" DOUBLE PRECISION,
ADD COLUMN     "vertical" "DatasetVertical" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" TEXT NOT NULL DEFAULT 'individual',
ADD COLUMN     "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AssetAuditLog" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "reviewerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "billingEmail" TEXT,
    "billingPlan" TEXT NOT NULL DEFAULT 'usage',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "datasetIds" TEXT[],
    "pricingModel" TEXT NOT NULL,
    "termMonths" INTEGER NOT NULL DEFAULT 12,
    "usageLimits" JSONB,
    "slaTier" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "totalValue" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "consentSource" TEXT NOT NULL,
    "usageRights" TEXT[],
    "geographicRestrictions" TEXT[],
    "dataRetentionPolicy" TEXT NOT NULL DEFAULT 'indefinite',
    "auditLogEnabled" BOOLEAN NOT NULL DEFAULT true,
    "complianceTags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "annotationConfidenceAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "interAnnotatorAgreement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewPassRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "benchmarkTasks" TEXT[],
    "lastAuditAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnotationEvent" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "annotatorType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnotationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachAsset" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT,
    "orgId" TEXT,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetRevenueLedger" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "buyerType" TEXT NOT NULL,
    "buyerOrgId" TEXT,
    "usageUnits" INTEGER NOT NULL,
    "priceUsd" DECIMAL(18,2) NOT NULL,
    "revenueShare" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DatasetRevenueLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SandboxAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyScope" TEXT[],
    "rateLimit" INTEGER NOT NULL DEFAULT 100,
    "datasetsPreloaded" TEXT[],
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SandboxAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickstartProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "datasetId" TEXT,
    "steps" TEXT[],
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickstartProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutorial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "datasetsUsed" TEXT[],
    "tools" TEXT[],
    "estimatedTime" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointDoc" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parameters" JSONB,
    "examples" JSONB NOT NULL,
    "avgLatencyMs" DOUBLE PRECISION,
    "commonUseCases" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndpointDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "variables" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedContract" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "orgId" TEXT,
    "datasetId" TEXT,
    "variables" JSONB NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "signedAt" TIMESTAMP(3),
    "signedByUserId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "staticContext" JSONB NOT NULL DEFAULT '{}',
    "dynamicContext" JSONB NOT NULL DEFAULT '{}',
    "searchPatterns" TEXT[],
    "preferredTypes" TEXT[],
    "topDatasets" TEXT[],
    "totalQueries" INTEGER NOT NULL DEFAULT 0,
    "avgQueryDepth" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "lastQueryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "reinforced" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "source" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SandboxAccount_userId_key" ON "SandboxAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuickstartProject_slug_key" ON "QuickstartProject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EndpointDoc_endpoint_key" ON "EndpointDoc"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_userId_key" ON "UserMemory"("userId");

-- CreateIndex
CREATE INDEX "MemoryEvent_userId_idx" ON "MemoryEvent"("userId");

-- CreateIndex
CREATE INDEX "MemoryEvent_entityType_idx" ON "MemoryEvent"("entityType");

-- CreateIndex
CREATE INDEX "MemoryEvent_createdAt_idx" ON "MemoryEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "AssetAuditLog" ADD CONSTRAINT "AssetAuditLog_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAuditLog" ADD CONSTRAINT "AssetAuditLog_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_governanceProfileId_fkey" FOREIGN KEY ("governanceProfileId") REFERENCES "GovernanceProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_qualityProfileId_fkey" FOREIGN KEY ("qualityProfileId") REFERENCES "QualityProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnotationEvent" ADD CONSTRAINT "AnnotationEvent_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachAsset" ADD CONSTRAINT "OutreachAsset_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachAsset" ADD CONSTRAINT "OutreachAsset_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxAccount" ADD CONSTRAINT "SandboxAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedContract" ADD CONSTRAINT "GeneratedContract_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContractTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
