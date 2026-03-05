'use client';

import { useState, useEffect } from 'react';
import { getMyEvaluations } from '../../../../services/evaluatee';
import BackButton from '../../../../components/BackButton';
import Link from 'next/link';
import { FileText, ClipboardList } from 'lucide-react';

export default function EvaluateeEvaluationsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyEvaluations();
                if (res.status === 'success') {
                    setAssignments(res.data.assignments || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6 pb-12 font-sans">
            <div>
                <div className="mb-2"><BackButton label="กลับ" /></div>
                <h1 className="text-2xl font-semibold text-white">การประเมินของฉัน</h1>
                <p className="text-gray-400 text-sm mt-1">ดูรายละเอียดและแนบหลักฐานสำหรับการประเมินของคุณ</p>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-950 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ลำดับ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ชื่อการประเมิน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ผู้ประเมิน</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {assignments.map((assignment, index) => (
                                <tr key={assignment.id} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{assignment.evaluation?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{assignment.evaluator?.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/evaluatee/evaluations/${assignment.evaluationId}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-950 text-primary-400 rounded-md hover:bg-primary-900 transition-colors whitespace-nowrap text-sm font-medium"
                                            >
                                                <FileText size={16} />
                                                <span>รายละเอียด</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {assignments.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">ไม่มีข้อมูลการประเมิน</h3>
                        <p className="text-gray-400 text-sm mt-1">คุณยังไม่มีการประเมินที่ต้องรับผิดชอบในขณะนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
