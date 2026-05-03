'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/log', label: 'Log' },
  { href: '/history', label: 'History' },
  { href: '/stats', label: 'Stats' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="mx-auto flex w-full max-w-[460px] flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/40 bg-slate-900/90 shadow-[0_0_24px_rgba(124,58,237,0.22)]">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              className="text-violet-200"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="3"
                ry="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="8"
                y="8"
                width="8"
                height="8"
                rx="2"
                ry="2"
                fill="currentColor"
              />
            </svg>
          </div>

          <div>
            <p className="text-[1.05rem] font-semibold leading-tight tracking-tight text-white">
              OpenMat
            </p>
            <p className="text-xs font-medium text-slate-400">
              BJJ training tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/75 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
          {links.map((link) => {
            const isActive =
              pathname === link.href || (pathname === '/' && link.href === '/log');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold transition duration-200 active:scale-[0.98]',
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
