import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Compliance Copilot — AI-Powered Compliance for Startups',
  description: 'Generate enterprise-grade compliance documents in minutes using 4 specialized AI agents. Built on complete.dev.',
  keywords: 'compliance, GDPR, SOC2, privacy policy, AI agents, startup compliance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
