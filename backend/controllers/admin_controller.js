const prisma = require('../utils/db');
const AppError = require('../utils/AppError');

// Evaluations
exports.createEvaluation = async (req, res, next) => {
    try {
        const evaluation = await prisma.evaluation.create({
            data: req.body
        });
        res.status(201).json({ status: 'success', message: 'สร้างแบบประเมินสำเร็จ', data: { evaluation } });
    } catch (err) { next(err); }
};

exports.getEvaluations = async (req, res, next) => {
    try {
        const evaluations = await prisma.evaluation.findMany({
            include: {
                topics: {
                    include: { indicators: true }
                },
                assignments: true
            }
        });
        res.status(200).json({ status: 'success', message: 'ดึงข้อมูลแบบประเมินสำเร็จ', data: { evaluations } });
    } catch (err) { next(err); }
};

exports.updateEvaluation = async (req, res, next) => {
    try {
        const evaluation = await prisma.evaluation.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.status(200).json({ status: 'success', message: 'อัปเดตแบบประเมินสำเร็จ', data: { evaluation } });
    } catch (err) { next(err); }
};

exports.deleteEvaluation = async (req, res, next) => {
    try {
        await prisma.evaluation.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({ status: 'success', message: 'ลบแบบประเมินสำเร็จ', data: null });
    } catch (err) { next(err); }
};

exports.getEvaluationDetails = async (req, res, next) => {
    try {
        const evaluation = await prisma.evaluation.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                topics: {
                    include: { indicators: true }
                },
                assignments: {
                    include: {
                        evaluator: { select: { id: true, name: true, email: true } },
                        evaluatee: { select: { id: true, name: true, email: true } },
                        results: true
                    }
                }
            }
        });

        if (!evaluation) {
            return next(new AppError('ไม่พบแบบประเมิน', 404));
        }

        res.status(200).json({ status: 'success', message: 'ดึงข้อมูลรายละเอียดแบบประเมินสำเร็จ', data: { evaluation } });
    } catch (err) { next(err); }
};

exports.getUsersByRole = async (req, res, next) => {
    try {
        const { role } = req.query;
        let where = {};
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            select: { id: true, name: true, email: true, role: true }
        });

        res.status(200).json({ status: 'success', message: 'ดึงข้อมูลผู้ใช้สำเร็จ', data: { users } });
    } catch (err) { next(err); }
};

// Topics
exports.createTopic = async (req, res, next) => {
    try {
        const topic = await prisma.topic.create({
            data: {
                name: req.body.name,
                evaluationId: parseInt(req.params.id)
            }
        });
        res.status(201).json({ status: 'success', message: 'สร้างหัวข้อการประเมินสำเร็จ', data: { topic } });
    } catch (err) { next(err); }
};

exports.updateTopic = async (req, res, next) => {
    try {
        const topic = await prisma.topic.update({
            where: { id: parseInt(req.params.id) },
            data: { name: req.body.name }
        });
        res.status(200).json({ status: 'success', message: 'อัปเดตหัวข้อการประเมินสำเร็จ', data: { topic } });
    } catch (err) { next(err); }
};

exports.deleteTopic = async (req, res, next) => {
    try {
        await prisma.topic.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({ status: 'success', message: 'ลบหัวข้อการประเมินสำเร็จ', data: null });
    } catch (err) { next(err); }
};

// Indicators Logic (Weight validation)
const checkWeightLimit = async (evaluationId, addingVal = 0, ignoreIndicatorId = null) => {
    const topics = await prisma.topic.findMany({
        where: { evaluationId },
        include: { indicators: true }
    });

    let totalWeight = 0;
    for (const t of topics) {
        for (const ind of t.indicators) {
            if (!ignoreIndicatorId || ind.id !== ignoreIndicatorId) {
                totalWeight += ind.weight;
            }
        }
    }

    if (totalWeight + addingVal > 100) {
        throw new AppError(`น้ำหนักรวมทั้งหมดจะเกิน 100% ปัจจุบัน: ${totalWeight}%, เพิ่มใหม่: ${addingVal}%`, 400);
    }
};

exports.createIndicator = async (req, res, next) => {
    try {
        const topicId = parseInt(req.params.id);
        const topic = await prisma.topic.findUnique({ where: { id: topicId } });
        if (!topic) return next(new AppError('ไม่พบหัวข้อการประเมิน', 404));

        await checkWeightLimit(topic.evaluationId, req.body.weight);

        const indicator = await prisma.indicator.create({
            data: {
                ...req.body,
                topicId
            }
        });
        res.status(201).json({ status: 'success', message: 'สร้างตัวชี้วัดสำเร็จ', data: { indicator } });
    } catch (err) { next(err); }
};

exports.updateIndicator = async (req, res, next) => {
    try {
        const indicatorId = parseInt(req.params.id);
        const existing = await prisma.indicator.findUnique({
            where: { id: indicatorId },
            include: { topic: true }
        });
        if (!existing) return next(new AppError('ไม่พบตัวชี้วัด', 404));

        if (req.body.weight) {
            await checkWeightLimit(existing.topic.evaluationId, req.body.weight, indicatorId);
        }

        const indicator = await prisma.indicator.update({
            where: { id: indicatorId },
            data: req.body
        });
        res.status(200).json({ status: 'success', message: 'อัปเดตตัวชี้วัดสำเร็จ', data: { indicator } });
    } catch (err) { next(err); }
};

exports.deleteIndicator = async (req, res, next) => {
    try {
        await prisma.indicator.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({ status: 'success', message: 'ลบตัวชี้วัดสำเร็จ', data: null });
    } catch (err) { next(err); }
};

// Assignments
exports.createAssignment = async (req, res, next) => {
    try {
        const { evaluationId, evaluatorId, evaluateeId } = req.body;

        if (evaluatorId === evaluateeId) {
            return next(new AppError('ผู้ประเมินและผู้รับการประเมินไม่สามารถเป็นคนเดียวกันได้', 400));
        }

        // Check duplicate
        const existing = await prisma.assignment.findUnique({
            where: {
                evaluationId_evaluatorId_evaluateeId: {
                    evaluationId, evaluatorId, evaluateeId
                }
            }
        });

        if (existing) {
            return next(new AppError('มีการมอบหมายนี้อยู่แล้ว', 409));
        }

        const assignment = await prisma.assignment.create({
            data: { evaluationId, evaluatorId, evaluateeId }
        });

        res.status(201).json({ status: 'success', message: 'มอบหมายสำเร็จ', data: { assignment } });
    } catch (err) {
        if (err.code === 'P2002') {
            return next(new AppError('มีการมอบหมายนี้อยู่แล้ว', 409));
        }
        next(err);
    }
};

exports.deleteAssignment = async (req, res, next) => {
    try {
        await prisma.assignment.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({ status: 'success', message: 'ลบการมอบหมายสำเร็จ', data: null });
    } catch (err) { next(err); }
};
