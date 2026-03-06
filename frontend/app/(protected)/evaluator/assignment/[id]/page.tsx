'use client';

import { useState, useEffect, use } from 'react';
import { getAssignmentForEvaluator, giveScore } from '../../../../../services/evaluator';
import BackButton from '../../../../../components/BackButton';
import Swal from '@/utils/swal';
import { Save, CheckCircle2, FileText, ExternalLink, AlertCircle } from 'lucide-react';

export default function EvaluatorAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const assignmentId = parseInt(resolvedParams.id);
    const [assignment, setAssignment] = useState<any>(null);
    const [evidenceList, setEvidenceList] = useState<any[]>([]);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await getAssignmentForEvaluator(assignmentId);
                if (res.status === 'success') {
                    setAssignment(res.data.assignment);
                    setEvidenceList(res.data.evidence || []);

                    // pre-load existing scores
                    const initialScores: Record<number, number> = {};
                    res.data.assignment.results?.forEach((r: any) => {
                        if (r.score !== null && r.score !== undefined) {
                            initialScores[r.indicatorId] = r.score;
                        }
                    });
                    setScores(initialScores);
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลแบบประเมินได้', 'error');
            }
        };
        fetchAssignment();
    }, [assignmentId]);

    if (!assignment) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    const evaluation = assignment.evaluation;
    const evaluatee = assignment.evaluatee;

    // Map results for easy lookup of evidence
    const resultsMap: Record<number, any> = {};
    assignment.results?.forEach((r: any) => {
        resultsMap[r.indicatorId] = r;
    });

    const handleScoreChange = (indicatorId: number, score: number) => {
        setScores(prev => ({ ...prev, [indicatorId]: score }));
    };

    const handleSubmit = async () => {
        // Validation: Check if all indicators with requireEvidence have evidence before scoring
        const indicators = evaluation?.topics?.flatMap((t: any) => t.indicators) || [];
        const unscoredRequired = indicators.filter((ind: any) => {
            const hasEvidence = evidenceList.some(e => e.indicatorId === ind.id);
            // If evidence is required, it MUST have evidence to be scored
            if (ind.requireEvidence && !hasEvidence && scores[ind.id] !== undefined) {
                return true;
            }
            return false;
        });

        if (unscoredRequired.length > 0) {
            Swal.fire('แจ้งเตือน', 'ตัวชี้วัดที่ต้องมีหลักฐาน แต่ยังไม่มีการแนบหลักฐาน ไม่สามารถให้คะแนนได้', 'warning');
            return;
        }

        setSaving(true);
        try {
            for (const indicatorIdStr of Object.keys(scores)) {
                const indicatorId = parseInt(indicatorIdStr);
                const score = scores[indicatorId];
                await giveScore(assignmentId, { indicatorId, score });
            }

            Swal.fire('สำเร็จ', 'บันทึกผลการประเมินเรียบร้อยแล้ว', 'success');
        } catch (err: any) {
            console.error(err);
            Swal.fire('Error', err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="mb-6"><BackButton label="รายการประเมินที่ได้รับมอบหมาย" /></div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">ประเมิน {evaluatee?.name}</h1>
                    <p className="text-sm text-slate-500 mt-1">แบบประเมิน: {evaluation?.name}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-900 uppercase tracking-wider">In Progress</span>
                </div>
            </div>

            <div className="space-y-6">
                {evaluation?.topics?.map((topic: any, index: number) => (
                    <div key={topic.id} className="bg-gray-900 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800">ส่วนที่ {index + 1}: {topic.name}</h2>
                        </div>
                        <div className="p-6">
                            {topic.indicators?.map((indicator: any, indIndex: number) => {
                                const currentScore = scores[indicator.id];
                                const evidence = evidenceList.find(e => e.indicatorId === indicator.id);
                                const hasEvidence = !!evidence;
                                const isDisabled = indicator.requireEvidence && !hasEvidence;

                                return (
                                    <div key={indicator.id} className="mb-8 last:mb-0 pb-8 last:pb-0 border-b border-slate-100 last:border-0">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="mb-3">
                                                    <p className="font-medium text-slate-800 text-lg">{indIndex + 1}. {indicator.name}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-xs text-primary-400 bg-primary-950 px-2 py-1 rounded border border-primary-900">น้ำหนัก {indicator.weight}%</span>
                                                        {indicator.requireEvidence && (
                                                            <span className="text-xs text-amber-400 bg-amber-950 px-2 py-1 rounded border border-amber-900">ต้องการหลักฐาน</span>
                                                        )}
                                                    </div>
                                                    {indicator.description && <p className="text-sm text-slate-500 mt-2">{indicator.description}</p>}
                                                </div>
                                            </div>

                                            {/* Evidence Section */}
                                            <div className="md:w-64 flex-shrink-0">
                                                <div className={`p-3 rounded-lg border ${hasEvidence ? 'bg-emerald-950 border-emerald-800' : 'bg-slate-50 border-slate-200'}`}>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">หลักฐานประกอบ</p>
                                                    {hasEvidence ? (
                                                        <a
                                                            href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '')}/${evidence.filePath.replace(/\\/g, '/').replace(/^.*(?=uploads\/)/, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-medium text-sm group"
                                                        >
                                                            <FileText size={18} className="group-hover:scale-110 transition-transform" />
                                                            <span>ดูหลักฐานแนบ</span>
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                            <AlertCircle size={18} />
                                                            <span>ยังไม่มีการแนบหลักฐาน</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            {isDisabled && (
                                                <p className="text-xs text-red-500 mb-2 font-medium flex items-center gap-1">
                                                    <AlertCircle size={14} /> * ต้องแนบหลักฐานก่อนจึงจะสามารถให้คะแนนได้
                                                </p>
                                            )}

                                            <div className={`${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                                {indicator.type === 'SCALE_1_4' && (
                                                    <div className="flex flex-wrap gap-3">
                                                        {[1, 2, 3, 4].map(scoreVal => (
                                                            <label key={scoreVal} className={`flex items-center justify-center min-w-[100px] p-3 border rounded-xl cursor-pointer transition-all ${currentScore === scoreVal ? 'border-primary-500 bg-primary-950 text-primary-300 font-bold shadow-sm ring-1 ring-primary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name={`ind-${indicator.id}`}
                                                                    value={scoreVal}
                                                                    checked={currentScore === scoreVal}
                                                                    onChange={() => handleScoreChange(indicator.id, scoreVal)}
                                                                    className="hidden"
                                                                />
                                                                ระดับ {scoreVal}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                {indicator.type === 'YES_NO' && (
                                                    <div className="flex flex-wrap gap-3">
                                                        <label className={`flex items-center justify-center px-8 py-3 border rounded-xl cursor-pointer transition-all ${currentScore === 1 ? 'border-green-500 bg-green-950 text-green-300 font-bold shadow-sm ring-1 ring-green-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`ind-${indicator.id}`}
                                                                value={1}
                                                                checked={currentScore === 1}
                                                                onChange={() => handleScoreChange(indicator.id, 1)}
                                                                className="hidden"
                                                            />
                                                            ใช่ / ผ่าน
                                                        </label>
                                                        <label className={`flex items-center justify-center px-8 py-3 border rounded-xl cursor-pointer transition-all ${currentScore === 0 ? 'border-red-500 bg-red-950 text-red-300 font-bold shadow-sm ring-1 ring-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`ind-${indicator.id}`}
                                                                value={0}
                                                                checked={currentScore === 0}
                                                                onChange={() => handleScoreChange(indicator.id, 0)}
                                                                className="hidden"
                                                            />
                                                            ไม่ใช่ / ไม่ผ่าน
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 mb-12 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-primary-200"
                >
                    {saving ? 'กำลังบันทึก...' : <><Save size={20} /> บันทึกผลการประเมิน</>}
                </button>
            </div>
        </div>
    );
}
