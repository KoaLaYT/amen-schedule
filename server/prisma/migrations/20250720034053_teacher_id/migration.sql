-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "teacherId" BIGINT NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "teacherId" BIGINT NOT NULL DEFAULT -1;

-- CreateIndex
CREATE INDEX "Lesson_teacherId_idx" ON "Lesson"("teacherId");
