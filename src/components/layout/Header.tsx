'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Navigation links configuration
 */
const navLinks = [
  { href: '/', label: '首页' },
  { href: '/notes', label: '笔记' },
  { href: '/projects', label: '项目' },
  { href: '/videos', label: '视频' },
  { href: '/blockchain', label: '区块链' },
  { href: '/resources', label: '资源' },
  { href: '/discussions', label: '讨论' },
  { href: '/about', label: '关于' },
];

/**
 * Header Component
 * Main navigation header with responsive design
 * Requirements: 9.1, 9.2, 9.3
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, isLoggedIn, logout, isLoading } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl hover:text-emerald-400 transition-colors"
          >
            <span className="text-2xl">⛓️</span>
            <span className="hidden sm:inline bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              BlockBlog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-700/50 rounded-lg animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    管理后台
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">
                    <span>{user?.username}</span>
                    {isAdmin && <span className="text-amber-400">(管理员)</span>}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/auth/change-password"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-t-lg"
                    >
                      修改密码
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-b-lg"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navLinks={navLinks}
        currentPath={pathname}
      />
    </header>
  );
}
