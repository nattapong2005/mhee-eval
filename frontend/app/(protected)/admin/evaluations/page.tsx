'use client';

import { useState, useEffect } from 'react';
import { getAdminEvaluations, createAdminEvaluation, updateAdminEvaluation, deleteAdminEvaluation } from '../../../../services/admin';
import { Evaluation } from '../../../../types';
import BackButton from '../../../../components/BackButton';
import Link from 'next/link';
import { Edit, Trash, Eye, Plus, X, ClipboardList } from 'lucide-react';
import Swal from '@/utils/swal';

export default function AdminEvaluationsPage() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        startAt: '',
        endAt: '',
        status: 'OPEN'
    });

    const fetchEvaluations = async () => {
        try {
            const res = await getAdminEvaluations();
            if (res.status === 'success') {
                setEvaluations(res.data.evaluations);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const openModal = () => {
        setEditId(null);
        setFormData({ name: '', startAt: '', endAt: '', status: 'OPEN' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleCreate = async () => {
        try {
            if (!formData.name || !formData.startAt || !formData.endAt) {
                Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
                return;
            }

            const payload = {
                name: formData.name,
                startAt: new Date(formData.startAt).toISOString(),
                endAt: new Date(formData.endAt).toISOString(),
                status: formData.status
            };

            await createAdminEvaluation(payload);
            Swal.fire({ icon: 'success', title: 'เพิ่มข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500 });
            closeModal();
            fetchEvaluations();
        } catch (err: any) {
            Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถเพิ่มข้อมูลได้', 'error');
        }
    };

    const inlineUpdate = async (id: number, data: any) => {
        try {
            await updateAdminEvaluation(id, data);
            Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500 });
            fetchEvaluations();
            setEditId(null);
        } catch (err: any) {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
        }
    };

    const confirmDelete = (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบข้อมูลนี้หรือไม่ ข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบออก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#eb4c4c',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'ใช่, ลบข้อมูล',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAdminEvaluation(id);
                    Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบออกจากระบบแล้ว', 'success');
                    fetchEvaluations();
                } catch (err) {
                    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error');
                }
            }
        });
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="mb-2"><BackButton label="กลับสู่แผงควบคุม" /></div>
                    <h1 className="text-2xl font-semibold text-white">รายการประเมิน</h1>
                    <p className="text-gray-400 text-sm mt-1">จัดการและติดตามรอบการประเมินผลงานทั้งหมดในระบบ</p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm"
                >
                    <Plus size={18} />
                    <span>สร้างรอบการประเมินใหม่</span>
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr className="bg-gray-950 border-b border-gray-800">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ลำดับ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ชื่อรอบการประเมิน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">วันที่เริ่ม</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">วันที่สิ้นสุด</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {evaluations.map((item, index) => {
                                const isEditing = editId === item.id;

                                if (isEditing) {
                                    return (
                                        <tr key={item.id} className="bg-primary-950">
                                            <td className="px-6 py-4 text-sm font-medium text-white">{String(index + 1).padStart(2, '0')}</td>
                                            <td className="px-6 py-4">
                                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input type="date" value={formData.startAt} onChange={(e) => setFormData({ ...formData, startAt: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input type="date" value={formData.endAt} onChange={(e) => setFormData({ ...formData, endAt: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => inlineUpdate(item.id, { name: formData.name, startAt: new Date(formData.startAt).toISOString(), endAt: new Date(formData.endAt).toISOString() })} className="bg-primary-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-600 transition-colors">บันทึก</button>
                                                    <button onClick={() => setEditId(null)} className="bg-gray-900 border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors">ยกเลิก</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-300">{new Date(item.startAt).toLocaleDateString('th-TH')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-300">{new Date(item.endAt).toLocaleDateString('th-TH')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={`/admin/evaluations/${item.id}`} className="text-gray-500 hover:text-primary-500 transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setEditId(item.id);
                                                        setFormData({
                                                            name: item.name,
                                                            startAt: item.startAt.split('T')[0],
                                                            endAt: item.endAt.split('T')[0],
                                                            status: 'OPEN'
                                                        });
                                                    }}
                                                    className="text-gray-500 hover:text-amber-500 transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => confirmDelete(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {evaluations.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">ไม่พบรายการประเมิน</h3>
                        <p className="text-gray-400 text-sm mt-1">เริ่มต้นโดยการสร้างรอบการประเมินแรกของคุณ</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex flex-col items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-lg overflow-hidden border border-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">สร้างรอบการประเมิน</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">ชื่อรอบการประเมิน</label>
                                    <input
                                        type="text"
                                        placeholder="เช่น ประเมินผลงานประจำปี 2567"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">วันที่เริ่ม</label>
                                        <input
                                            type="date"
                                            value={formData.startAt}
                                            onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">วันที่สิ้นสุด</label>
                                        <input
                                            type="date"
                                            value={formData.endAt}
                                            onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors text-sm font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
                                >
                                    ยืนยันการสร้าง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
