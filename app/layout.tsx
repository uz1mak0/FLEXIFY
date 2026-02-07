import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FLEXIFY',
  description: 'FLEXIFY - A modern social media platform that everyone can share their experiences in life'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="dark">{children}</body>
    </html>
  );
}
