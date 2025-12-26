'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  username: string;
  onLogout: () => void;
}

/**
 * Admin navigation links configuration
 */
const adminNavLinks = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/notes', label: '笔记管理', icon: '📝' },
  { href: '/admin/projects', label: '项目管理', icon: '🚀' },
  { href: '/admin/resources', label: '资源管理', icon: '📦' },
  { href: '/admin/videos', label: '视频管理', icon: '🎬' },
  { href: '/admin/contact-requests', label: '联系申请', icon: '📬' },
];

/**
 * Admin Sidebar Component
 * Navigation sidebar for admin dashboard
 * Requirements: 10.1
 */
export default function AdminSidebar({ username, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d14] border-r border-emerald-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-500/20">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-2xl">⛓️</span>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            管理后台
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminNavLinks.map((link) => {
          const isActive = pathname === link.href || 
            (link.href !== '/admin' && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-sm">👤</span>
            </div>
            <span className="text-sm text-gray-300">{username}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>🚪</span>
          <span>退出登录</span>
        </button>
        <Link
          href="/"
          className="mt-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>🏠</span>
          <span>返回前台</span>
        </Link>
      </div>
    </aside>
  );
}
