import Link from 'next/link';

/**
 * Footer navigation links
 */
const footerLinks = {
  content: [
    { href: '/notes', label: '笔记' },
    { href: '/projects', label: '项目' },
    { href: '/videos', label: '视频' },
    { href: '/blockchain', label: '区块链' },
  ],
  community: [
    { href: '/discussions', label: '讨论区' },
    { href: '/resources', label: '资源' },
    { href: '/about', label: '关于我' },
  ],
};

/**
 * Social links
 */
const socialLinks = [
  { href: 'https://github.com', label: 'GitHub', icon: '🐙' },
  { href: 'https://twitter.com', label: 'Twitter', icon: '🐦' },
  { href: 'https://t.me', label: 'Telegram', icon: '✈️' },
  { href: 'mailto:contact@example.com', label: 'Email', icon: '📧' },
];

/**
 * Footer Component
 * Site footer with navigation links and social media
 * Requirements: 9.1, 9.2
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white font-bold text-xl mb-4"
            >
              <span className="text-2xl">⛓️</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                BlockBlog
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              探索区块链技术的无限可能，分享交易策略与开发经验。加入我们的社区，一起学习成长。
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl hover:bg-emerald-500/20 hover:scale-110 transition-all duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">内容</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">社区</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-500/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} BlockBlog. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>Built with</span>
              <span className="text-red-500">❤️</span>
              <span>and</span>
              <span className="text-emerald-400">Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
