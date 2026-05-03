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
        <div className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,rgba(124,58,237,0.22),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#020617_100%)]">
          <header className="px-4 pb-3 pt-4 sm:pt-6">
            <NavBar />
          </header>

          <main className="px-4 pb-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
