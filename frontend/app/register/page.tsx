'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register, getDepartments } from '../../services/auth';
import Swal from '@/utils/swal';
import Link from 'next/link';
import { Department } from '../../types';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EVALUATEE',
        departmentId: 0
    });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getDepartments();
                if (res.status === 'success') {
                    setDepartments(res.data.departments);
                    if (res.data.departments.length > 0) {
                        setFormData(prev => ({ ...prev, departmentId: res.data.departments[0].id }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.departmentId) {
            Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }

        setLoading(true);
        try {
            const res = await register({
                ...formData,
                departmentId: Number(formData.departmentId)
            });
            if (res.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ',
                    text: 'กรุณาเข้าสู่ระบบเพื่อใช้งาน',
                    timer: 2000,
                    showConfirmButton: false,
                });
                router.push('/login');
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ลงทะเบียนไม่สำเร็จ',
                text: error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 font-sans">
            <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 shadow-sm rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">ลงทะเบียน</h1>
                    <p className="text-gray-400 mt-2 text-sm">เข้าร่วมระบบประเมินผลบุคลากร</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            placeholder="ชื่อ นามสกุล"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">แผนก</label>
                            <select
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white appearance-none cursor-pointer"
                            >
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">บทบาท</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white appearance-none cursor-pointer"
                            >
                                <option value="EVALUATEE">ผู้รับการประเมิน</option>
                                <option value="EVALUATOR">ผู้ประเมิน</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">อีเมลผู้ใช้งาน</label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm mt-6 flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? 'กำลังดำเนินการ...' : 'สร้างบัญชีผู้ใช้งาน'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
                        <Link href="/login" className="text-primary-500 hover:text-primary-400 font-medium hover:underline transition-colors">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
