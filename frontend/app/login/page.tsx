'use client';

import { useState } from 'react';
import Swal from '@/utils/swal';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/services/auth';

export default function LoginPage() {
    const { loginState } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        try {
            const res = await login({ email, password });
            if (res.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ',
                    timer: 1500,
                    showConfirmButton: false,
                });
                loginState(res.token, res.data.user);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans">
            <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 shadow-sm rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">เข้าสู่ระบบ</h1>
                    <p className="text-gray-400 mt-2 text-sm">ระบบประเมินผลบุคลากร</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">อีเมลผู้ใช้งาน</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm mt-6 flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        ยังไม่มีบัญชีผู้ใช้งาน?{' '}
                        <Link href="/register" className="text-primary-500 hover:text-primary-400 font-medium hover:underline transition-colors">
                            สร้างบัญชีใหม่
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
