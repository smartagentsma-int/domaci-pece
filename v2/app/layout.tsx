import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Domácí Péče | Profesionální domácí péče s lidským přístupem',
  description: 'Pomáháme pacientům zůstat doma bezpečně, důstojně a s odbornou péčí. Komplexní domácí zdravotní péče a ošetřovatelské služby.',
  keywords: 'domácí péče, zdravotní péče doma, ošetřovatelská péče, domácí zdravotní péče, pacienti, senior péče',
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
