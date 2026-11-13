import './globals.css';

export const metadata = {
  title: 'RR War Room: IPL 2027 Auction Scouting Dashboard | SupeRR Selector S2',
  description: 'Rajasthan Royals War Room Analytics Dashboard - High-Pressure Reliability Matrix & Auction Intelligence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-navy-900 text-slate-100 min-h-screen selection:bg-rr-pink selection:text-white">
        {children}
      </body>
    </html>
  );
}

