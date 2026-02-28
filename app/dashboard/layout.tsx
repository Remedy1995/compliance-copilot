'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', emoji: '🏠' },
  { href: '/dashboard/privacy-policy', label: 'Privacy Policy', emoji: '📜' },
  { href: '/dashboard/soc2-checklist', label: 'SOC2 Checklist', emoji: '✅' },
  { href: '/dashboard/gdpr-docs', label: 'GDPR Suite', emoji: '🇪🇺' },
  { href: '/dashboard/security-arch', label: 'Security Arch', emoji: '🏗️' },
  { href: '/dashboard/vendor-risk', label: 'Vendor Risk', emoji: '📋' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = () => { localStorage.removeItem('auth_token'); router.push('/login'); };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 sidebar-gradient flex flex-col fixed h-full z-40 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-blue-400 rounded-lg flex items-center justify-center text-sm">🛡️</div>
            <span className="font-bold text-white text-base">Compliance Copilot</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/15 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-violet-400 rounded-full"></span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
