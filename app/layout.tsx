import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PicEdit — Instagram Preset Editor',
  description:
    'Make your Instagram feed look consistent. Apply beautiful AI-powered style presets to your photos in seconds.',
  openGraph: {
    title: 'PicEdit — Instagram Preset Editor',
    description: 'Apply beautiful AI-powered style presets to your photos.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
