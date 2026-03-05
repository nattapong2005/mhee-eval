'use client';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, CheckSquare, ClipboardList, Settings, User, Users } from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const menus = [
        { name: 'Dashboard', path: '/home', icon: LayoutDashboard },
    ];

    if (user.role === 'ADMIN') {
        menus.push({ name: 'จัดการการประเมิน', path: '/admin/evaluations', icon: Settings });
        menus.push({ name: 'จัดการผู้ใช้งาน', path: '/admin/users', icon: Users });
    } else if (user.role === 'EVALUATOR') {
        menus.push({ name: 'รายการประเมิน', path: '/evaluator/evaluations', icon: ClipboardList });
    } else if (user.role === 'EVALUATEE') {
        menus.push({ name: 'การประเมินของฉัน', path: '/evaluatee/evaluations', icon: CheckSquare });
    }

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen fixed z-20">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-800">
                <Link href="/home" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center text-white">
                        <LayoutDashboard size={18} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white leading-tight">CORE</span>
                        <span className="text-xs text-gray-400">Assessment</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="px-4 space-y-1">
                    <div className="px-4 mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Menu</p>
                    </div>
                    {menus.map((m) => {
                        const Icon = m.icon;
                        const active = pathname === m.path || (m.path !== '/home' && pathname.startsWith(m.path));
                        return (
                            <Link key={m.path} href={m.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${active
                                    ? 'bg-primary-950 text-primary-400 font-medium'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-primary-500" : "text-gray-500"} />
                                <span className="text-sm">{m.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-md bg-gray-950">
                    <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400">
                        <User size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-red-400 hover:bg-red-950 rounded-md transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
