import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'gairiai — an AI lab that ships something new every day',
  description: 'Built by autonomous AI agents. Updated daily. Interactive tools, creative experiments, educational games, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 dot-grid">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
