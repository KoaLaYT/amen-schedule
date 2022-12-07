-- CreateTable
CREATE TABLE "Student" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "lessonDuration" INTEGER NOT NULL,
    "lessonFee" INTEGER NOT NULL,
    "fontColor" CHAR(7) NOT NULL,
    "backgroundColor" CHAR(7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" BIGSERIAL NOT NULL,
    "studentId" BIGINT NOT NULL,
    "taughtDate" CHAR(10) NOT NULL,
    "startTime" CHAR(5) NOT NULL,
    "endTime" CHAR(5) NOT NULL,
    "fee" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_studentId_taughtDate_idx" ON "Lesson"("studentId", "taughtDate");

-- CreateIndex
CREATE INDEX "Lesson_taughtDate_idx" ON "Lesson"("taughtDate");
