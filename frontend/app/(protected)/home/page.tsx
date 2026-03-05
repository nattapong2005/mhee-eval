'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getAdminEvaluations, getUsersByRole } from '../../../services/admin';
import { getEvaluationsForEvaluator } from '../../../services/evaluator';
import { getMyEvaluations } from '../../../services/evaluatee';
import { Users, ClipboardList, CheckSquare, BarChart3, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvaluations: 0,
        totalEvaluators: 0,
        totalEvaluatees: 0,
        assignedEvaluations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (user?.role === 'ADMIN') {
                    const [evalRes, evaluatorsRes, evaluateesRes] = await Promise.all([
                        getAdminEvaluations(),
                        getUsersByRole('EVALUATOR'),
                        getUsersByRole('EVALUATEE')
                    ]);

                    setStats({
                        totalEvaluations: evalRes.status === 'success' ? evalRes.data.evaluations.length : 0,
                        totalEvaluators: evaluatorsRes.status === 'success' ? evaluatorsRes.data.users.length : 0,
                        totalEvaluatees: evaluateesRes.status === 'success' ? evaluateesRes.data.users.length : 0,
                        assignedEvaluations: 0
                    });
                } else if (user?.role === 'EVALUATOR') {
                    const res = await getEvaluationsForEvaluator();
                    if (res.status === 'success') {
                        setStats(prev => ({
                            ...prev,
                            assignedEvaluations: res.data.evaluations?.length || 0,
                        }));
                    }
                } else if (user?.role === 'EVALUATEE') {
                    const res = await getMyEvaluations();
                    if (res.status === 'success') {
                        setStats(prev => ({
                            ...prev,
                            assignedEvaluations: res.data.assignments?.length || 0,
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchData();
        }
    }, [user]);

    if (!user) return null;

    const renderStatCard = (title: string, value: number, icon: any, highlightMode: 'primary' | 'other' = 'other', link?: string) => {
        const Icon = icon;
        const rootClass = "bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-sm transition-colors";
        const hoverClass = link ? "hover:border-primary-500 hover:shadow-md cursor-pointer" : "";
        const iconBg = highlightMode === 'primary' ? 'bg-primary-950 text-primary-400' : 'bg-gray-950 text-gray-400';

        const CardContent = (
            <div className={`${rootClass} ${hoverClass} h-full flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}>
                        <Icon size={20} />
                    </div>
                    {link && (
                        <div className="text-gray-500">
                            <ArrowUpRight size={18} />
                        </div>
                    )}
                </div>
                <div className="mt-auto">
                    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-semibold text-white">
                            {loading ? '...' : value}
                        </h2>
                    </div>
                </div>
            </div>
        );

        if (link) {
            return <Link href={link} className="block">{CardContent}</Link>;
        }
        return <div className="block">{CardContent}</div>;
    };

    return (
        <div className="space-y-8 pb-10 font-sans">
            <div>
                <h1 className="text-2xl font-semibold text-white">Overview</h1>
                <p className="text-gray-400 text-sm mt-1">ยินดีต้อนรับกลับมา, <span className="font-medium text-white">{user.name}</span></p>
            </div>

            {user.role === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderStatCard("รายการประเมินทั้งหมด", stats.totalEvaluations, ClipboardList, 'primary', "/admin/evaluations")}
                    {renderStatCard("ผู้ประเมินในระบบ", stats.totalEvaluators, Users, 'other')}
                    {renderStatCard("ผู้รับการประเมิน", stats.totalEvaluatees, Users, 'other')}
                </div>
            )}

            {user.role === 'EVALUATOR' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderStatCard("งานที่ได้รับมอบหมาย", stats.assignedEvaluations, CheckSquare, 'primary', "/evaluator/evaluations")}
                </div>
            )}

            {user.role === 'EVALUATEE' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderStatCard("การประเมินของฉัน", stats.assignedEvaluations, CheckSquare, 'primary', "/evaluatee/evaluations")}
                </div>
            )}

            <div className="bg-gray-900 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <BarChart3 size={20} className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-white">สรุปข้อมูลระบบ</h3>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-200">กำลังดำเนินการ</span>
                            <span className="text-sm font-semibold text-white">65%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary-500 h-full rounded-full w-[65%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-200">รอการตรวจสอบ</span>
                            <span className="text-sm font-semibold text-white">35%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gray-300 h-full rounded-full w-[35%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}