-- AlterTable
ALTER TABLE "CaptureSession" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "UserAnnotation" ADD COLUMN     "boundingBox" JSONB,
ADD COLUMN     "endTime" DOUBLE PRECISION,
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "startTime" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
