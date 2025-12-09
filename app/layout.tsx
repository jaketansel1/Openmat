import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenMat',
  description: 'BJJ session tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-slate-950 text-slate-50'}>
        <div className="min-h-screen flex flex-col">
          {/* Top nav */}
          <header className="px-4 py-3 bg-slate-950">
  <NavBar />
</header>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
