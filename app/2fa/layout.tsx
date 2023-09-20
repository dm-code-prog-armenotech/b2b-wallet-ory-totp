import '../globals.css';

import { ReactNode } from 'react';
import { Navbar } from '../navbar';
import QP from './query-provider';
import { ToastContainer } from '../toast';

export const metadata = {
  title: 'Ory TOTP demo | 2FA',
  description:
    'A demo dashboard type of app, that provides 2fa with Google Authenticator, powered by Ory Kratos'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={'h-full bg-gray-50'}>
      <body className={'h-full bg-gray-50'}>
        <Navbar />
        <ToastContainer />
        <QP>{children}</QP>
      </body>
    </html>
  );
}
