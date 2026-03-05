import sys

file_path = r"e:\Competency\mhee_eval\frontend\app\(protected)\admin\evaluations\[id]\page.tsx"

new_content = """'use client';

import { useState, useEffect, use } from 'react';
import {
    getEvaluationDetails,
    createTopic, updateTopic, deleteTopic,
    createIndicator, updateIndicator, deleteIndicator,
    createAssignment, deleteAssignment, getUsersByRole
} from '../../../../../services/admin';
import BackButton from '../../../../../components/BackButton';
import { Plus, Trash, Edit, RefreshCw, Layers, Users, BarChart3, ChevronRight, CheckCircle2, AlertCircle, FileText, Settings2, Info } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminEvaluationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const evaluationId = parseInt(resolvedParams.id);

    const [activeTab, setActiveTab] = useState(1);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newTopicName, setNewTopicName] = useState('');
    const [topicEditingId, setTopicEditingId] = useState<number | null>(null);
    const [editTopicName, setEditTopicName] = useState('');

    const [indicatorForm, setIndicatorForm] = useState({ topicId: 0, name: '', type: 'SCALE_1_4', weight: 0, requireEvidence: false });
    const [indicatorEditingId, setIndicatorEditingId] = useState<number | null>(null);

    const [users, setUsers] = useState<any[]>([]);
    const [assignmentForm, setAssignmentForm] = useState({ evaluatorId: '', evaluateeId: '' });

    const fetchDetails = async () => {
        try {
            const res = await getEvaluationDetails(evaluationId);
            if (res.status === 'success') {
                setEvaluation(res.data.evaluation);
            }
        } catch (e) {
            console.error(e);
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลการประเมินได้', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getUsersByRole();
            if (res.status === 'success') {
                setUsers(res.data.users);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchDetails();
        fetchUsers();
    }, [evaluationId]);

    // ==== Tab 1: Topics & Indicators ====
    const handleAddTopic = async () => {
        if (!newTopicName.trim()) return;
        try {
            await createTopic(evaluationId, { name: newTopicName });
            setNewTopicName('');
            fetchDetails();
            Swal.fire('สำเร็จ', 'เพิ่มหัวข้อประเมินแล้ว', 'success');
        } catch (e: any) {
            Swal.fire('ข้อผิดพลาด', e.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
        }
    };

    const handleUpdateTopic = async (id: number) => {
        if (!editTopicName.trim()) return;
        try {
            await updateTopic(id, { name: editTopicName });
            setTopicEditingId(null);
            fetchDetails();
            Swal.fire('สำเร็จ', 'แก้ไขหัวข้อประเมินแล้ว', 'success');
        } catch (e: any) {
            Swal.fire('ข้อผิดพลาด', e.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
        }
    };

    const handleDeleteTopic = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: 'คุณต้องการลบหัวข้อการประเมินนี้ใช่หรือไม่? ตัวชี้วัดภายใต้หัวข้อนี้จะถูกลบไปด้วย',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });
        if (confirm.isConfirmed) {
            try {
                await deleteTopic(id);
                fetchDetails();
                Swal.fire('สำเร็จ', 'ลบหัวข้อประเมินแล้ว', 'success');
            } catch (e: any) {
                Swal.fire('ข้อผิดพลาด', e.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
            }
        }
    };

    const handleAddIndicator = async () => {
        if (!indicatorForm.topicId || !indicatorForm.name || indicatorForm.weight <= 0) {
            Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลตัวชี้วัดให้ครบถ้วน', 'error');
            return;
        }
        try {
            if (indicatorEditingId) {
                await updateIndicator(indicatorEditingId, {
                    name: indicatorForm.name,
                    type: indicatorForm.type,
                    requireEvidence: indicatorForm.requireEvidence,
                    weight: Number(indicatorForm.weight)
                });
                setIndicatorEditingId(null);
                Swal.fire('สำเร็จ', 'แก้ไขตัวชี้วัดแล้ว', 'success');
            } else {
                await createIndicator(indicatorForm.topicId, {
                    name: indicatorForm.name,
                    type: indicatorForm.type,
                    requireEvidence: indicatorForm.requireEvidence,
                    weight: Number(indicatorForm.weight)
                });
                Swal.fire('สำเร็จ', 'เพิ่มตัวชี้วัดแล้ว', 'success');
            }
            setIndicatorForm({ topicId: 0, name: '', type: 'SCALE_1_4', weight: 0, requireEvidence: false });
            fetchDetails();
        } catch (e: any) {
            Swal.fire('ข้อผิดพลาด', e.response?.data?.message || 'น้ำหนักรวมอาจเกิน 100%', 'error');
        }
    };

    const handleDeleteIndicator = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: 'คุณต้องการลบตัวชี้วัดนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });
        if (confirm.isConfirmed) {
            try {
                await deleteIndicator(id);
                fetchDetails();
                Swal.fire('สำเร็จ', 'ลบตัวชี้วัดแล้ว', 'success');
            } catch (e: any) {
                Swal.fire('ข้อผิดพลาด', e.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
            }
        }
    };

    // ==== Tab 2: Assignments ====
    const handleAddAssignment = async () => {
        if (!assignmentForm.evaluatorId || !assignmentForm.evaluateeId) {
            Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกผู้ประเมินและผู้รับการประเมิน', 'error');
            return;
        }
        try {
            await createAssignment({
                evaluationId,
                evaluatorId: parseInt(assignmentForm.evaluatorId),
                evaluateeId: parseInt(assignmentForm.evaluateeId)
            });
            setAssignmentForm({ evaluatorId: '', evaluateeId: '' });
            fetchDetails();
            Swal.fire('สำเร็จ', 'เพิ่มคู่ประเมินแล้ว', 'success');
        } catch (e: any) {
            let msg = 'เกิดข้อผิดพลาด';
            if (e.response?.data?.message === 'DUPLICATE_ASSIGNMENT') msg = 'ผู้ประเมินและผู้ถูกประเมินคู่นี้มีอยู่แล้ว';
            if (e.response?.data?.message === 'evaluatorId cannot be same as evaluateeId') msg = 'ไม่สามารถประเมินตัวเองได้';
            Swal.fire('ข้อผิดพลาด', msg, 'error');
        }
    };

    const handleDeleteAssignment = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: 'ลบคู่ประเมินนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });
        if (confirm.isConfirmed) {
            try {
                await deleteAssignment(id);
                fetchDetails();
                Swal.fire('สำเร็จ', 'ลบคู่ประเมินแล้ว', 'success');
            } catch (e: any) {
                Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาด', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 flex justify-center items-center h-screen"><RefreshCw className="w-10 h-10 animate-spin text-primary-500" /></div>;

    const evaluators = users.filter(u => u.role === 'EVALUATOR');
    const evaluatees = users.filter(u => u.role === 'EVALUATEE');

    let totalWeight = 0;
    evaluation?.topics.forEach((t: any) => {
        t.indicators.forEach((i: any) => {
            totalWeight += i.weight;
        });
    });

    const tabs = [
        { id: 1, name: 'หัวข้อและตัวชี้วัด', icon: Layers },
        { id: 2, name: 'จับคู่การประเมิน', icon: Users },
        { id: 3, name: 'ข้อมูลสถิติผลงาน', icon: BarChart3 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans">
            <div className="pt-2">
                <BackButton label="กลับไปหน้ารวม" />
            </div>

            {/* HEADER BANNER - CLEAN MODERN LOOK */}
            <div className="relative border-b border-gray-800 pb-8 mt-4">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-900 border border-gray-700 text-gray-300 rounded-md text-xs font-semibold tracking-wider">ID: {evaluationId}</span>
                            <span className={`px-3 py-1 rounded-md text-xs font-semibold ${totalWeight === 100 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                น้ำหนักรวม {totalWeight}%
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{evaluation?.name}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-400 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                <span>เริ่ม: <span className="text-gray-200">{evaluation?.startAt ? new Date(evaluation.startAt).toLocaleDateString('th-TH') : '-'}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                <span>สิ้นสุด: <span className="text-gray-200">{evaluation?.endAt ? new Date(evaluation.endAt).toLocaleDateString('th-TH') : '-'}</span></span>
                            </div>
                        </div>
                    </div>
                    {totalWeight !== 100 && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
                            <AlertCircle size={16} /> แนะนำให้ตั้งค่าน้ำหนักตัวชี้วัดรวมเป็น 100%
                        </div>
                    )}
                </div>
            </div>

            {/* MINIMAL TABS STRIP */}
            <div className="flex gap-8 border-b border-gray-800/80 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 pb-4 pt-2 text-sm font-medium transition-all relative whitespace-nowrap ${
                                active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.name}
                            {active && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500 rounded-t-full shadow-[0_-2px_10px_rgba(235,76,76,0.6)]"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="min-h-[500px]">
                {/* TAB 1: TOPICS & INDICATORS */}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* Editor Panel (Left) */}
                        <div className="xl:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {evaluation?.topics.map((topic: any, index: number) => (
                                <div key={topic.id} className="bg-[#0f1115] rounded-xl border border-gray-800/60 overflow-hidden group/topic">
                                    <div className="px-6 py-5 flex justify-between items-center bg-gray-900/40 border-b border-gray-800/60">
                                        {topicEditingId === topic.id ? (
                                            <div className="flex gap-3 items-center w-full">
                                                <input
                                                    className="bg-[#1a1d24] border border-gray-700 px-4 py-2.5 rounded-lg w-full text-sm font-medium text-gray-100 outline-none focus:border-primary-500 transition-colors"
                                                    value={editTopicName}
                                                    onChange={e => setEditTopicName(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdateTopic(topic.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">บันทึก</button>
                                                <button onClick={() => setTopicEditingId(null)} className="text-gray-400 text-sm font-medium hover:text-white px-2 transition-colors">ยกเลิก</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded border border-gray-800 bg-[#1a1d24] flex items-center justify-center text-gray-400 text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <h3 className="font-semibold text-gray-100 text-lg tracking-tight">{topic.name}</h3>
                                                <button onClick={() => { setTopicEditingId(topic.id); setEditTopicName(topic.name); }} className="text-gray-500 hover:text-primary-500 transition-colors p-1"><Edit size={16} /></button>
                                            </div>
                                        )}
                                        {topicEditingId !== topic.id && (
                                            <button onClick={() => handleDeleteTopic(topic.id)} className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-gray-600 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash size={16} /></button>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        {topic.indicators.length > 0 ? (
                                            <div className="space-y-3">
                                                {topic.indicators.map((ind: any) => (
                                                    <div key={ind.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-800/80 bg-[#14171c] hover:border-gray-700 transition-all group/ind">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <FileText size={16} className="text-gray-500" />
                                                                <p className="font-medium text-gray-200 text-sm">{ind.name}</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2 ml-7">
                                                                <span className="px-2 py-0.5 bg-gray-800/50 text-gray-400 rounded text-xs font-medium border border-gray-700/50">
                                                                    {ind.type === 'SCALE_1_4' ? '1-4 Scale' : 'Yes/No'}
                                                                </span>
                                                                {ind.requireEvidence && (
                                                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500/90 rounded text-xs font-medium border border-amber-500/20">แนบหลักฐาน</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6 sm:ml-4 pl-7 sm:pl-0">
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-xs text-gray-500">น้ำหนัก</span>
                                                                <span className="text-base font-semibold text-primary-400">{ind.weight}%</span>
                                                            </div>
                                                            <div className="flex gap-1 border-l border-gray-800 pl-4">
                                                                <button
                                                                    onClick={() => {
                                                                        setIndicatorEditingId(ind.id);
                                                                        setIndicatorForm({ topicId: topic.id, name: ind.name, type: ind.type, requireEvidence: ind.requireEvidence, weight: ind.weight });
                                                                    }}
                                                                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-800 hover:text-primary-400 transition-all"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteIndicator(ind.id)}
                                                                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                                >
                                                                    <Trash size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500 text-sm">
                                                ไม่มีตัวชี้วัด กดเพิ่มตัวชี้วัดที่แผงด้านขวา
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Topic Clean Input */}
                            <div className="flex gap-4 items-center p-2 rounded-xl border border-gray-800 bg-[#0f1115] focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 transition-all">
                                <Plus size={20} className="text-gray-500 ml-4" />
                                <input
                                    type="text"
                                    placeholder="เพิ่มหัวข้อประเมินใหม่ (กด Enter เพื่อบันทึก)"
                                    className="bg-transparent py-4 w-full text-sm font-medium text-gray-200 outline-none placeholder:text-gray-600"
                                    value={newTopicName}
                                    onChange={e => setNewTopicName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                                />
                                {newTopicName.trim() && (
                                    <button onClick={handleAddTopic} className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 mr-2 hover:bg-gray-200">
                                        บันทึก
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sticky Setup Panel (Right) */}
                        <div className="xl:col-span-4">
                            <div className="sticky top-28 bg-[#0f1115] rounded-xl border border-gray-800 p-6 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800/80">
                                    <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
                                        <Settings2 size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-100">
                                        {indicatorEditingId ? "แก้ไขตัวชี้วัด" : "สร้างตัวชี้วัดใหม่"}
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-400">เลือกหัวข้อเป้าหมาย</label>
                                        <select
                                            className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-2.5 outline-none focus:border-gray-500 text-sm font-medium text-gray-200 appearance-none disabled:opacity-50"
                                            value={indicatorForm.topicId}
                                            onChange={e => setIndicatorForm({ ...indicatorForm, topicId: parseInt(e.target.value) })}
                                            disabled={!!indicatorEditingId}
                                        >
                                            <option value={0}>-- กรุณาเลือก --</option>
                                            {evaluation?.topics.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-400">ชื่อตัวชี้วัด</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-2.5 outline-none focus:border-gray-500 text-sm font-medium text-gray-200 placeholder:text-gray-600"
                                            value={indicatorForm.name}
                                            onChange={e => setIndicatorForm({ ...indicatorForm, name: e.target.value })}
                                            placeholder="ระบุสิ่งที่ต้องการวัด..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400">รูปแบบการวัด</label>
                                            <select
                                                className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-2.5 outline-none focus:border-gray-500 text-sm font-medium text-gray-200"
                                                value={indicatorForm.type}
                                                onChange={e => setIndicatorForm({ ...indicatorForm, type: e.target.value })}
                                            >
                                                <option value="SCALE_1_4">สเกล 1-4</option>
                                                <option value="YES_NO">ใช่ / ไม่ใช่</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400">สัดส่วนคะแนน (%)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:border-gray-500 text-sm font-medium text-gray-200"
                                                    value={indicatorForm.weight || ''}
                                                    onChange={e => setIndicatorForm({ ...indicatorForm, weight: parseInt(e.target.value) || 0 })}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-[#1a1d24] rounded-lg border border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Info size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-300">แนบหลักฐานอ้างอิง?</span>
                                        </div>
                                        <button
                                            onClick={() => setIndicatorForm({ ...indicatorForm, requireEvidence: !indicatorForm.requireEvidence })}
                                            className={`w-11 h-6 rounded-full transition-colors relative ${indicatorForm.requireEvidence ? 'bg-primary-500' : 'bg-gray-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${indicatorForm.requireEvidence ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                        </button>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        {indicatorEditingId && (
                                            <button 
                                                onClick={() => { setIndicatorEditingId(null); setIndicatorForm({ topicId: 0, name: '', type: 'SCALE_1_4', weight: 0, requireEvidence: false }); }} 
                                                className="w-full py-2.5 bg-gray-800 text-gray-200 hover:bg-gray-700 rounded-lg font-semibold text-sm transition-colors"
                                            >
                                                ยกเลิก
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAddIndicator}
                                            className="w-full py-2.5 bg-primary-500 text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors active:scale-[0.98]"
                                        >
                                            {indicatorEditingId ? "บันทึกการแก้ไข" : "เพิ่มตัวชี้วัด"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: ASSIGNMENTS (MINIMALIST VIEW) */}
                {activeTab === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
                        <div className="bg-[#0f1115] rounded-xl border border-gray-800 p-8 mb-8">
                            <h2 className="text-lg font-semibold text-white mb-6">ตั้งค่าการจับคู่ประเมิน</h2>
                            <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-sm font-medium text-gray-400">ผู้ประเมิน (Evaluator)</label>
                                    <select
                                        className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-3 outline-none focus:border-gray-500 transition-all text-sm font-medium text-gray-200"
                                        value={assignmentForm.evaluatorId}
                                        onChange={e => setAssignmentForm({ ...assignmentForm, evaluatorId: e.target.value })}
                                    >
                                        <option value="">ค้นหาผู้ประเมิน...</option>
                                        {evaluators.map(u => <option key={`ev-${u.id}`} value={u.id}>{u.name} — {u.email}</option>)}
                                    </select>
                                </div>
                                <div className="hidden md:flex items-center justify-center pb-3 text-gray-600">
                                    <ChevronRight size={24} />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-sm font-medium text-gray-400">ผู้รับการประเมิน (Evaluatee)</label>
                                    <select
                                        className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-3 outline-none focus:border-gray-500 transition-all text-sm font-medium text-gray-200"
                                        value={assignmentForm.evaluateeId}
                                        onChange={e => setAssignmentForm({ ...assignmentForm, evaluateeId: e.target.value })}
                                    >
                                        <option value="">ค้นหาผู้รับการประเมิน...</option>
                                        {evaluatees.map(u => <option key={`ee-${u.id}`} value={u.id}>{u.name} — {u.email}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={handleAddAssignment}
                                    className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors w-full md:w-auto mt-4 md:mt-0"
                                >
                                    เพิ่มจับคู่
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-base font-semibold text-gray-300">รายการจับคู่ปัจจุบัน ({evaluation?.assignments?.length || 0})</h3>
                            </div>
                            <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#0f1115]">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-800 bg-gray-900/40">
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">ผู้ประเมิน</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">ผู้รับการประเมิน</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {evaluation?.assignments?.map((a: any) => (
                                            <tr key={a.id} className="hover:bg-gray-800/20 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                                                            {a.evaluator?.name?.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-200 text-sm">{a.evaluator?.name}</p>
                                                            <p className="text-xs text-gray-500">{a.evaluator?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                                                            {a.evaluatee?.name?.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-200 text-sm">{a.evaluatee?.name}</p>
                                                            <p className="text-xs text-gray-500">{a.evaluatee?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button onClick={() => handleDeleteAssignment(a.id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!evaluation?.assignments || evaluation.assignments.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="py-16 text-center text-gray-500">
                                                    ไม่มีการจับคู่ประเมินสำหรับรอบนี้
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: RESULTS (MODERN LIST) */}
                {activeTab === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-primary-500" size={24} />
                            <h2 className="text-xl font-semibold text-white">รายงานผลการประเมินเบื้องต้น</h2>
                        </div>

                        <div className="space-y-3">
                            {evaluation?.assignments?.filter((a: any) => a.results && a.results.length > 0).length === 0 ? (
                                <div className="py-24 text-center border border-gray-800 border-dashed rounded-xl bg-[#0f1115]">
                                    <div className="text-gray-600 mb-3"><BarChart3 size={40} className="mx-auto" /></div>
                                    <h3 className="text-lg font-medium text-gray-300">ยังไม่มีข้อมูลผลบันทึก</h3>
                                    <p className="text-gray-500 text-sm">ผู้ประเมินยังไม่ได้บันทึกผลเข้าระบบ</p>
                                </div>
                            ) : (
                                evaluation?.assignments?.map((a: any) => {
                                    if (!a.results || a.results.length === 0) return null;
                                    return (
                                        <div key={a.id} className="flex items-center justify-between p-5 bg-[#0f1115] border border-gray-800 hover:border-gray-700 rounded-xl transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center font-bold text-sm text-gray-400">
                                                    {a.evaluatee?.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-100 text-base">{a.evaluatee?.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">ประเมินโดย {a.evaluator?.name}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-xs text-gray-500 mb-1">ความคืบหน้า</p>
                                                    <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ตรวจแล้ว {a.results.length} รายการ</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary-500 font-semibold text-sm cursor-pointer hover:text-primary-400">
                                                    รายละเอียด <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated Complete")
