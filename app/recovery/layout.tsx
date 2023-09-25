import '../globals.css';
import { Navbar } from '../navbar';
import { ToastContainer } from '../toast';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Ory TOTP demo | Recovery',
  description:
    'A demo dashboard type of app, that provides 2fa with Google Authenticator, powered by Ory Kratos'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={'h-full'}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className={'h-full'}>
        <Navbar />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
