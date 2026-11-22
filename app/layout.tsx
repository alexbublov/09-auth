import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import './globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const robotoFont = Roboto({
  variable: '--roboto-font',
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600', '800'],
  display: 'auto',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your thoughts organized and accessible in one place, whether you are at home or on the go.',
  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your thoughts organized and accessible in one place, whether you are at home or on the go.',
    url: 'https://notehub.com/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - a simple and efficient application designed for managing personal notes.',
      },
    ],
    type: 'website',
  },
};

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={robotoFont.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
