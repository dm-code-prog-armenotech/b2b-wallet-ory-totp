import type { ReactNode } from 'react';
import '../globals.css';

export const metadata = {
  title: 'Ory TOTP demo | Error',
  description: 'A demo dashboard type of app, that provides 2fa with Google Authenticator, powered by Ory Kratos'
};

export default function RootLayout({
                                     children
                                   }: {
  children: ReactNode
}) {
  return (
    <html lang='en'>
    <body>{children}</body>
    </html>
  );
}
