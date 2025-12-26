'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  currentPath: string;
}

/**
 * MobileMenu Component
 * Collapsible hamburger menu for mobile devices
 * Requirements: 9.3
 */
export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  currentPath,
}: MobileMenuProps) {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-16 left-0 right-0 bottom-0 bg-[#0a0a0f] z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== '/' && currentPath.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth Section */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400">
                  {user?.username}
                  {isAdmin && <span className="ml-1 text-amber-400">(管理员)</span>}
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="block px-4 py-3 text-amber-400 hover:bg-amber-500/10 rounded-lg"
                  >
                    管理后台
                  </Link>
                )}
                <Link
                  href="/auth/change-password"
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  修改密码
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  onClick={onClose}
                  className="block px-4 py-3 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
