'use client';

import { useState, useEffect, use } from 'react';
import { getEvaluationsForEvaluator } from '../../../../../services/evaluator';
import BackButton from '../../../../../components/BackButton';
import Link from 'next/link';
import { CheckCircle2, ClipboardList } from 'lucide-react';

export default function EvaluatorAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const evaluationId = parseInt(resolvedParams.id);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEvaluationsForEvaluator(evaluationId);
                if (res.status === 'success') {
                    setEvaluation(res.data.evaluation);
                    setAssignments(res.data.assignments || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [evaluationId]);

    if (!evaluation) return <div className="p-8 text-center text-gray-400">Loading...</div>;

    // Calculate total indicators to compute progress
    const totalIndicators = evaluation.topics?.reduce((acc: number, topic: any) => acc + (topic.indicators?.length || 0), 0) || 0;

    return (
        <div className="space-y-6 pb-12 font-sans">
            <div>
                <div className="mb-2"><BackButton label="กลับ" /></div>
                <h1 className="text-2xl font-semibold text-white">{evaluation.name}</h1>
                <p className="text-sm text-gray-400 mt-1">
                    เริ่ม {new Date(evaluation.startAt).toLocaleDateString()} - สิ้นสุด {new Date(evaluation.endAt).toLocaleDateString()}
                </p>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-950 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ลำดับ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ชื่อผู้รับการประเมิน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">สถานะการแนบหลักฐาน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ความคืบหน้าการประเมิน</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {assignments.map((assignment, index) => {
                                const scoredCount = assignment.results?.length || 0;
                                const progress = totalIndicators > 0 ? (scoredCount / totalIndicators) * 100 : 0;
                                const isCompleted = scoredCount === totalIndicators && totalIndicators > 0;

                                return (
                                    <tr key={assignment.id} className="hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{assignment.evaluatee?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">รอตรวจสอบหลักฐาน</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-full bg-gray-800 rounded-full h-1.5 min-w-[100px] max-w-[200px] overflow-hidden">
                                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-400">{scoredCount}/{totalIndicators}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {isCompleted ? (
                                                    <Link href={`/evaluator/assignment/${assignment.id}/result`} className="inline-flex items-center gap-2 px-4 py-2 text-emerald-400 bg-emerald-950 rounded-md hover:bg-emerald-900 text-sm font-medium transition-colors whitespace-nowrap">
                                                        <CheckCircle2 size={16} />
                                                        <span>ดูผลการประเมิน</span>
                                                    </Link>
                                                ) : (
                                                    <Link href={`/evaluator/assignment/${assignment.id}`} className="inline-flex items-center gap-2 px-4 py-2 text-primary-400 bg-primary-950 rounded-md hover:bg-primary-900 text-sm font-medium transition-colors whitespace-nowrap">
                                                        <ClipboardList size={16} />
                                                        <span>เริ่มประเมิน</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {assignments.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">ไม่มีข้อมูล</h3>
                        <p className="text-gray-400 text-sm mt-1">ยังไม่มีผู้รับการประเมินในรอบนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
