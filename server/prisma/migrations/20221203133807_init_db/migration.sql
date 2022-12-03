-- CreateTable
CREATE TABLE `Student` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `lessonDuration` INTEGER NOT NULL,
    `lessonFee` INTEGER NOT NULL,
    `fontColor` CHAR(7) NOT NULL,
    `backgroundColor` CHAR(7) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `deleteAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `studentId` BIGINT NOT NULL,
    `taughtDate` CHAR(10) NOT NULL,
    `startTime` CHAR(5) NOT NULL,
    `endTime` CHAR(5) NOT NULL,
    `fee` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    INDEX `Lesson_studentId_taughtDate_idx`(`studentId`, `taughtDate`),
    INDEX `Lesson_taughtDate_idx`(`taughtDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
