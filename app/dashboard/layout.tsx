'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href:'/dashboard', label:'Overview', emoji:'🏠', exact:true },
  { href:'/dashboard/privacy-policy', label:'Privacy Policy', emoji:'📜', exact:false },
  { href:'/dashboard/soc2-checklist', label:'SOC2 Checklist', emoji:'✅', exact:false },
  { href:'/dashboard/gdpr-docs', label:'GDPR Suite', emoji:'🇪🇺', exact:false },
  { href:'/dashboard/security-arch', label:'Security Arch', emoji:'🏗️', exact:false },
  { href:'/dashboard/vendor-risk', label:'Vendor Risk', emoji:'📋', exact:false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => { localStorage.removeItem('auth_token'); router.push('/login'); };
  const isActive = (item: typeof NAV_ITEMS[0]) => item.exact ? pathname === item.href : pathname === item.href;

  const SidebarContent = () => (
    <>
      <div className="p-5 sm:p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-400 to-blue-400 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-lg group-hover:scale-110 transition-transform">🛡️</div>
          <div>
            <p className="font-black text-white text-sm leading-tight">Compliance</p>
            <p className="font-black text-white text-sm leading-tight">Copilot</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest px-3 mb-3">Tools</p>
        {NAV_ITEMS.map(item => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all group ${active ? 'bg-white/15 text-white shadow-sm border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <span className={`text-base transition-transform ${active ? '' : 'group-hover:scale-110'}`}>{item.emoji}</span>
              <span className="flex-1">{item.label}</span>
              {active && <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
        <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs font-bold text-violet-300 mb-0.5">🤖 Powered by</p>
          <p className="text-xs text-gray-400">complete.dev · 4 agents</p>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all font-medium">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 sidebar-gradient flex-col fixed h-full z-40 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-blue-400 rounded-lg flex items-center justify-center text-sm">🛡️</div>
          <span className="font-black text-white text-sm">Compliance Copilot</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 sidebar-gradient flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
