'use client';

import { useState, useEffect, use } from 'react';
import { getMyEvaluationDetails, uploadEvidence } from '../../../../../services/evaluatee';
import BackButton from '../../../../../components/BackButton';
import Swal from '@/utils/swal';
import { Upload, FileText, CheckCircle2, Award, Info, AlertCircle, ClipboardList } from 'lucide-react';

export default function EvaluateeEvaluationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const evaluationId = parseInt(resolvedParams.id);
    const [assignment, setAssignment] = useState<any>(null);
    const [evidenceList, setEvidenceList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [uploadingIndicatorId, setUploadingIndicatorId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const res = await getMyEvaluationDetails(evaluationId);
            if (res.status === 'success') {
                setAssignment(res.data.assignment);
                setEvidenceList(res.data.evidence || []);
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [evaluationId]);

    const handleFileUpload = async (indicatorId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file size exceeds 10MB
        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            Swal.fire('Error', `ขนาดไฟล์ต้องไม่เกิน ${MAX_SIZE_MB}MB`, 'error');
            e.target.value = '';
            return;
        }

        setUploadingIndicatorId(indicatorId);

        const formData = new FormData();
        formData.append('indicatorId', String(indicatorId));
        formData.append('evidence', file);

        try {
            await uploadEvidence(evaluationId, formData);
            Swal.fire({
                title: 'สำเร็จ',
                text: 'อัปโหลดหลักฐานเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonColor: '#EB4C4C'
            });
            fetchData();
        } catch (err: any) {
            console.error(err);
            Swal.fire('Error', err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
        } finally {
            setUploadingIndicatorId(null);
            // Reset the input so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400 font-sans">Loading...</div>;
    if (!assignment) return <div className="p-8 text-center text-gray-400 font-sans">ไม่พบข้อมูลการประเมินนี้</div>;

    const evaluation = assignment.evaluation;
    const evaluator = assignment.evaluator;

    // Helper to get uploaded evidence for an indicator
    const getEvidenceForIndicator = (indicatorId: number) => {
        return evidenceList.find(e => e.indicatorId === indicatorId);
    };

    // Calculate completion
    const totalIndicators = evaluation.topics?.reduce((acc: number, topic: any) => acc + (topic.indicators?.length || 0), 0) || 0;
    const scoredResults = assignment.results?.filter((r: any) => r.score !== null && r.score !== undefined) || [];
    const scoredCount = scoredResults.length;
    const isCompleted = scoredCount === totalIndicators && totalIndicators > 0;

    // Map results by indicatorId
    const resultsMap: Record<number, any> = {};
    assignment.results?.forEach((r: any) => {
        resultsMap[r.indicatorId] = r;
    });

    return (
        <div className="space-y-6 pb-12 font-sans">
            <div>
                <div className="mb-2"><BackButton label="รายการประเมินของฉัน" /></div>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-100">{evaluation.name}</h1>
                    <div className="mt-2 text-sm text-gray-400 flex flex-col sm:flex-row sm:gap-6 gap-2">
                        <p className="flex items-center gap-1.5"><span className="text-gray-500">ผู้ประเมิน:</span> <span className="font-medium text-gray-200">{evaluator?.name}</span></p>
                        <p className="flex items-center gap-1.5"><span className="text-gray-500">ระยะเวลา:</span> <span className="font-medium text-gray-200">{new Date(evaluation.startAt).toLocaleDateString()} - {new Date(evaluation.endAt).toLocaleDateString()}</span></p>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    {isCompleted ? (
                        <div className="bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-emerald-900">
                            <Award size={16} /> ประเมินสิ้นสุดแล้ว
                        </div>
                    ) : (
                        <div className="bg-gray-800 text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                            <Info size={16} /> อยู่ระหว่างการประเมิน ({scoredCount}/{totalIndicators})
                        </div>
                    )}
                </div>
            </div>

            {isCompleted && (
                <div className="bg-primary-950 border border-primary-900 p-4 rounded-lg flex items-start gap-3">
                    <div className="p-2 bg-primary-900 rounded-md text-primary-400 shrink-0">
                        <Award size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary-200">สรุปผลการประเมิน</h3>
                        <p className="text-primary-300 text-sm mt-0.5">ผู้ประเมินได้ทำการให้คะแนนครบทุกตัวชี้วัดแล้ว คุณสามารถตรวจสอบคะแนนได้ในแต่ละหัวข้อด้านล่าง</p>
                    </div>
                </div>
            )}

            <div className="space-y-5">
                {evaluation.topics?.map((topic: any, index: number) => (
                    <div key={topic.id} className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                        <div className="bg-gray-950 px-5 py-3 border-b border-gray-800">
                            <h2 className="font-semibold text-gray-100">ส่วนที่ {index + 1}: {topic.name}</h2>
                        </div>
                        <div className="p-5">
                            {topic.indicators?.map((indicator: any, indIndex: number) => {
                                const evidence = getEvidenceForIndicator(indicator.id);
                                const isUploading = uploadingIndicatorId === indicator.id;
                                const result = resultsMap[indicator.id];
                                const hasScore = result && result.score !== null && result.score !== undefined;

                                return (
                                    <div key={indicator.id} className="mb-5 last:mb-0 pb-5 last:pb-0 border-b border-gray-800 last:border-0">
                                        <div className="flex flex-col lg:flex-row justify-between gap-5 lg:items-start">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-2">
                                                    <span className="font-medium text-gray-100 shrink-0">{indIndex + 1}.</span>
                                                    <div>
                                                        <p className="font-medium text-gray-100">
                                                            {indicator.name}
                                                        </p>
                                                        {indicator.requireEvidence && !isCompleted && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-800 text-gray-300 px-2 py-0.5 rounded mt-1.5">
                                                                <AlertCircle size={10} /> จำเป็นต้องแนบหลักฐาน
                                                            </span>
                                                        )}
                                                        {indicator.description && <p className="text-sm text-gray-400 mt-2">{indicator.description}</p>}

                                                        {evidence && (
                                                            <div className="mt-3 flex flex-col gap-2">
                                                                <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-950 p-3 rounded-lg border border-gray-800 w-fit">
                                                                    <FileText size={16} className="text-gray-500" />
                                                                    <span>ตรวจสอบไฟล์หลักฐานแนบเรียบร้อยแล้ว</span>
                                                                </div>
                                                                <a
                                                                    href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '')}/${evidence.filePath.replace(/\\/g, '/').replace(/^.*(?=uploads\/)/, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-primary-400 hover:text-primary-300 underline ml-1 w-fit"
                                                                >
                                                                    คลิกเพื่อดูไฟล์ที่อัปโหลด
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-auto mt-2 lg:mt-0 flex flex-col lg:items-end gap-2 shrink-0">
                                                {isCompleted ? (
                                                    <div className="text-right bg-gray-950 p-3 rounded-lg border border-gray-800 min-w-[120px]">
                                                        {indicator.type === 'SCALE_1_4' ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs text-gray-400 font-medium mb-1">คะแนนที่ได้</span>
                                                                <div className="text-base font-bold text-white">
                                                                    ระดับ {result?.score}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs text-gray-400 font-medium mb-1">ผลการประเมิน</span>
                                                                <div className={`text-sm font-bold ${result?.score === 1 ? 'text-emerald-400' : 'text-primary-400'}`}>
                                                                    {result?.score === 1 ? 'ผ่าน' : 'ไม่ผ่าน'}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    indicator.requireEvidence && (
                                                        <div className="flex flex-col gap-2 lg:items-end">
                                                            {evidence ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                                                                    <CheckCircle2 size={16} /> แนบหลักฐานแล้ว
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-amber-400 font-medium flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                                                    รอการแนบหลักฐาน
                                                                </div>
                                                            )}

                                                            <label className={`inline-flex items-center gap-2 px-3 py-2 ${isUploading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-gray-200 hover:bg-gray-800 border-gray-600 hover:border-gray-400'} border rounded-md text-sm font-medium cursor-pointer transition-colors w-fit`}>
                                                                <Upload size={16} />
                                                                {isUploading ? 'อัปโหลด...' : (evidence ? 'เปลี่ยนไฟล์' : 'อัปโหลดหลักฐาน')}
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => handleFileUpload(indicator.id, e)}
                                                                    disabled={isUploading}
                                                                />
                                                            </label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {topic.indicators?.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4 bg-gray-950/50 rounded-md border border-dashed border-gray-700">ไม่มีตัวชี้วัดในหัวข้อนี้</p>
                            )}
                        </div>
                    </div>
                ))}

                {evaluation.topics?.length === 0 && (
                    <div className="bg-gray-900 p-12 rounded-lg shadow-sm border border-gray-700 text-center text-gray-400 flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-gray-950 rounded-full flex items-center justify-center mb-3 text-gray-500">
                            <ClipboardList size={28} />
                        </div>
                        <p className="font-medium">ยังไม่มีหัวข้อการประเมินในขณะนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
