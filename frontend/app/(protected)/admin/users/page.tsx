'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../../../services/admin';
import { register, getDepartments } from '../../../../services/auth';
import { useAuth } from '../../../../contexts/AuthContext';
import { User, Department } from '../../../../types';
import BackButton from '../../../../components/BackButton';
import { Edit, Trash, Plus, X, Users } from 'lucide-react';
import Swal from '@/utils/swal';

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EVALUATEE',
        departmentId: ''
    });

    const fetchUsers = async () => {
        try {
            const res = await getAdminUsers();
            if (res.status === 'success') {
                setUsers(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await getDepartments();
            if (res.status === 'success') {
                setDepartments(res.data.departments);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const openModal = () => {
        setEditId(null);
        setFormData({ name: '', email: '', password: '', role: 'EVALUATEE', departmentId: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleCreate = async () => {
        try {
            if (!formData.name || !formData.email || !formData.password || !formData.role) {
                Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
                return;
            }

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                departmentId: formData.departmentId ? Number(formData.departmentId) : undefined
            };

            await register(payload);
            Swal.fire({ icon: 'success', title: 'เพิ่มข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500 });
            closeModal();
            fetchUsers();
        } catch (err: any) {
            Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถเพิ่มข้อมูลได้', 'error');
        }
    };

    const inlineUpdate = async (id: number, currentData: any) => {
        try {
            const payload = {
                name: currentData.name,
                email: currentData.email,
                role: currentData.role,
                departmentId: currentData.departmentId ? Number(currentData.departmentId) : undefined
            };
            await updateAdminUser(id, payload);
            Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500 });
            fetchUsers();
            setEditId(null);
        } catch (err: any) {
            Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
        }
    };

    const confirmDelete = (id: number) => {
        if (currentUser && currentUser.id === id) {
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถลบบัญชีของตนเองได้', 'error');
            return;
        }

        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบผู้ใช้นี้หรือไม่ ข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบออก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#eb4c4c',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'ใช่, ลบข้อมูล',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAdminUser(id);
                    Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบออกจากระบบแล้ว', 'success');
                    fetchUsers();
                } catch (err: any) {
                    Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถลบข้อมูลได้', 'error');
                }
            }
        });
    };

    const [editData, setEditData] = useState<any>({});

    return (
        <div className="space-y-6 pb-12 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="mb-2"><BackButton label="กลับสู่แผงควบคุม" /></div>
                    <h1 className="text-2xl font-semibold text-white">การจัดการผู้ใช้งาน</h1>
                    <p className="text-gray-400 text-sm mt-1">จัดการผู้ใช้งาน กำหนดบทบาท และสิทธิ์ในระบบ</p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm"
                >
                    <Plus size={18} />
                    <span>สร้างผู้ใช้งานใหม่</span>
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr className="bg-gray-950 border-b border-gray-800">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ชื่อ - สกุล</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">อีเมล</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">บทบาท</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">แผนก</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {users.map((item) => {
                                const isEditing = editId === item.id;

                                if (isEditing) {
                                    return (
                                        <tr key={item.id} className="bg-primary-950">
                                            <td className="px-6 py-4 text-sm font-medium text-white">{item.id}</td>
                                            <td className="px-6 py-4">
                                                <input type="text" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 outline-none transition-colors" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input type="email" value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 outline-none transition-colors" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select value={editData.role || ''} onChange={(e) => setEditData({ ...editData, role: e.target.value as any })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 outline-none transition-colors">
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="EVALUATOR">EVALUATOR</option>
                                                    <option value="EVALUATEE">EVALUATEE</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select value={editData.departmentId || ''} onChange={(e) => setEditData({ ...editData, departmentId: e.target.value })} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 w-full text-sm font-medium text-white focus:ring-1 focus:ring-primary-500 outline-none transition-colors">
                                                    <option value="">ไม่มีแผนก</option>
                                                    {departments.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => inlineUpdate(item.id, editData)} className="bg-primary-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-600 transition-colors">บันทึก</button>
                                                    <button onClick={() => setEditId(null)} className="bg-gray-900 border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors">ยกเลิก</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }

                                const deptName = item.departmentId ? departments.find(d => d.id === item.departmentId)?.name || `Dept ${item.departmentId}` : '-';

                                return (
                                    <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">{item.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{item.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${item.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                item.role === 'EVALUATOR' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                                                    'bg-emerald-950 text-emerald-400 border border-emerald-900'
                                                }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">{deptName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditId(item.id);
                                                        setEditData({
                                                            name: item.name,
                                                            email: item.email,
                                                            role: item.role,
                                                            departmentId: item.departmentId || ''
                                                        });
                                                    }}
                                                    className="text-gray-500 hover:text-amber-500 transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item.id)}
                                                    className={`transition-colors ${currentUser?.id === item.id ? 'text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-red-500'}`}
                                                    title={currentUser?.id === item.id ? "ไม่สามารถลบตัวเองได้" : "ลบ"}
                                                    disabled={currentUser?.id === item.id}
                                                >
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
                {users.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <Users size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">ไม่พบผู้ใช้งาน</h3>
                        <p className="text-gray-400 text-sm mt-1">เริ่มต้นโดยการสร้างผู้ใช้งานใหม่ชองคุณ</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex flex-col items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-lg overflow-hidden border border-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">สร้างผู้ใช้งาน</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">ชื่อ - สกุล</label>
                                    <input
                                        type="text"
                                        placeholder="เช่น สมชาย ใจดี"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">อีเมล</label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">รหัสผ่าน</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">บทบาท</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                        >
                                            <option value="EVALUATEE">ผู้รับการประเมิน</option>
                                            <option value="EVALUATOR">ผู้ประเมิน</option>
                                            <option value="ADMIN">ผู้ดูแลระบบ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">แผนก</label>
                                        <select
                                            value={formData.departmentId}
                                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm text-white"
                                        >
                                            <option value="">ไม่มีแผนก</option>
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
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
