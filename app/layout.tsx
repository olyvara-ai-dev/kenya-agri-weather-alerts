import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgriShield AI',
  description: 'Weather intelligence that protects every harvest.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
