import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import { Suspense } from 'react';
import { ToastContainer } from '../toast';

export const metadata = {
  title: 'Ory TOTP demo',
  description:
    'A demo dashboard type of app, that provides 2fa with Google Authenticator, powered by Ory Kratos'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        {children}
        <ToastContainer />
        <Analytics />
      </body>
    </html>
  );
}
