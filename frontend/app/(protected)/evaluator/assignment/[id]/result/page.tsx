'use client';

import { useState, useEffect, use } from 'react';
import { getAssignmentForEvaluator } from '../../../../../../services/evaluator';
import BackButton from '../../../../../../components/BackButton';

export default function EvaluatorAssignmentResultPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const assignmentId = parseInt(resolvedParams.id);
    const [assignment, setAssignment] = useState<any>(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await getAssignmentForEvaluator(assignmentId);
                if (res.status === 'success') {
                    setAssignment(res.data.assignment);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssignment();
    }, [assignmentId]);

    if (!assignment) return <div className="p-8 text-center text-gray-400 font-sans">Loading...</div>;

    const evaluation = assignment.evaluation;
    const evaluatee = assignment.evaluatee;

    // Map results by indicatorId for easy lookup
    const resultsMap: Record<number, number> = {};
    assignment.results?.forEach((r: any) => {
        resultsMap[r.indicatorId] = r.score;
    });

    return (
        <div className="font-sans">
            <div className="mb-6"><BackButton label="รายการประเมินที่ได้รับมอบหมาย" /></div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-6 flex flex-col gap-1 shadow-sm">
                <h1 className="text-xl font-semibold text-white">ผลการประเมิน {evaluatee?.name} (เสร็จสิ้น)</h1>
                <p className="text-sm text-gray-400">แบบประเมิน: {evaluation?.name}</p>
            </div>

            <div className="space-y-6">
                {evaluation?.topics?.map((topic: any, index: number) => (
                    <div key={topic.id} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gray-950 px-6 py-4 border-b border-gray-700">
                            <h2 className="text-base font-semibold text-white">ส่วนที่ {index + 1}: {topic.name}</h2>
                        </div>
                        <div className="p-6">
                            {topic.indicators?.map((indicator: any, indIndex: number) => {
                                const currentScore = resultsMap[indicator.id];
                                return (
                                    <div key={indicator.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-gray-800 last:border-0 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-100">{indIndex + 1}. {indicator.name} <span className="text-xs text-primary-400 ml-2">(น้ำหนัก {indicator.weight}%)</span></p>
                                        </div>

                                        <div className="text-right">
                                            {indicator.type === 'SCALE_1_4' && (
                                                <span className="font-medium text-sm bg-primary-950 text-primary-300 px-3 py-1 rounded-md border border-primary-900">
                                                    ระดับ {currentScore || '-'}
                                                </span>
                                            )}

                                            {indicator.type === 'YES_NO' && (
                                                <span className={`font-medium text-sm px-3 py-1 rounded-md border ${currentScore === 1 ? 'bg-green-950 text-green-300 border-green-800' : 'bg-red-950 text-red-300 border-red-800'}`}>
                                                    {currentScore === 1 ? 'ใช่ / ผ่าน' : (currentScore === 0 ? 'ไม่ใช่ / ไม่ผ่าน' : '-')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
