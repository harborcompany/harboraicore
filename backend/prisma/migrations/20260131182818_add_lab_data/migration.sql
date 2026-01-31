-- CreateTable
CREATE TABLE "LabDataset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabeledVideo" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabeledVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnnotation" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,
    "action" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "boundingBox" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoAnnotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LabeledVideo" ADD CONSTRAINT "LabeledVideo_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "LabDataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnnotation" ADD CONSTRAINT "VideoAnnotation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "LabeledVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
