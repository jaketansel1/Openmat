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
      <div className="max-w-md mx-auto flex flex-col gap-5">

        {/* Brand row */}
        <div className="flex items-center gap-2 pl-1">
          <div className="h-7 w-7 rounded-xl bg-slate-900 border border-violet-500 flex items-center justify-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              className="text-violet-300"
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

          <span className="text-lg font-semibold tracking-tight text-white">
            OpenMat
          </span>
        </div>

        {/* Nav pills */}
        <div className="flex items-center gap-2 bg-slate-900 rounded-full p-1 border border-slate-700/70">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex-1 text-center text-sm font-medium rounded-full px-3 py-1.5 transition',
                  isActive
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800',
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
