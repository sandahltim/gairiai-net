'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Newspaper, GraduationCap, Wrench, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

const nav = [
  { href: '/daily', label: 'Daily Builds', icon: Sparkles },
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/little-learners', label: 'Little Learners', icon: GraduationCap },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/about', label: 'About', icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-dim bg-surface/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black tracking-tight gradient-text">gairiai</span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 hidden sm:block">lab</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'text-white bg-white/5'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-zinc-400 p-1">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border-dim bg-surface p-2 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  active ? 'text-white bg-white/5' : 'text-zinc-400'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
