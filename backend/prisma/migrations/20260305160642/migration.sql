-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_evaluateeId_fkey`;

-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_evaluationId_fkey`;

-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_evaluatorId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluationresult` DROP FOREIGN KEY `EvaluationResult_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluationresult` DROP FOREIGN KEY `EvaluationResult_indicatorId_fkey`;

-- DropForeignKey
ALTER TABLE `evidence` DROP FOREIGN KEY `Evidence_indicatorId_fkey`;

-- DropForeignKey
ALTER TABLE `indicator` DROP FOREIGN KEY `Indicator_topicId_fkey`;

-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `Topic_evaluationId_fkey`;

-- DropIndex
DROP INDEX `Assignment_evaluateeId_fkey` ON `assignment`;

-- DropIndex
DROP INDEX `Assignment_evaluatorId_fkey` ON `assignment`;

-- DropIndex
DROP INDEX `EvaluationResult_indicatorId_fkey` ON `evaluationresult`;

-- DropIndex
DROP INDEX `Indicator_topicId_fkey` ON `indicator`;

-- DropIndex
DROP INDEX `Topic_evaluationId_fkey` ON `topic`;

-- AddForeignKey
ALTER TABLE `Topic` ADD CONSTRAINT `Topic_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Indicator` ADD CONSTRAINT `Indicator_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_evaluateeId_fkey` FOREIGN KEY (`evaluateeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evidence` ADD CONSTRAINT `Evidence_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `Indicator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationResult` ADD CONSTRAINT `EvaluationResult_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationResult` ADD CONSTRAINT `EvaluationResult_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `Indicator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
