'use client';

import { useState, useEffect } from 'react';
import { getEvaluationsForEvaluator } from '../../../../services/evaluator';
import BackButton from '../../../../components/BackButton';
import Link from 'next/link';
import { Users, ClipboardList } from 'lucide-react';

export default function EvaluatorEvaluationsPage() {
    const [evaluations, setEvaluations] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEvaluationsForEvaluator();
                if (res.status === 'success') {
                    // Assuming backend returns an array of unique evaluations from assignments
                    setEvaluations(res.data.evaluations || []);
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
                <h1 className="text-2xl font-semibold text-white">รายการแบบประเมินที่ได้รับมอบหมาย</h1>
                <p className="text-gray-400 text-sm mt-1">จัดการคู่ประเมินสำหรับรอบการประเมินต่างๆ</p>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-950 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ลำดับ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ชื่อการประเมิน</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">จัดการคู่ประเมิน</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {evaluations.map((ev, index) => (
                                <tr key={ev.id} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{ev.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/evaluator/evaluations/${ev.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-950 text-primary-400 rounded-md hover:bg-primary-900 transition-colors whitespace-nowrap text-sm font-medium"
                                            >
                                                <Users size={16} />
                                                <span>จัดการคู่ประเมิน</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {evaluations.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">ไม่มีข้อมูล</h3>
                        <p className="text-gray-400 text-sm mt-1">คุณยังไม่ได้รับการมอบหมายแบบประเมินใดๆ</p>
                    </div>
                )}
            </div>
        </div>
    );
}
