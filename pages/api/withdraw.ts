import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from '@ory/kratos-client';

const KRATOS_URL = process.env.KRATOS_URL;
const ORY_KRATOS_SESSION = 'ory_kratos_session';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = req.cookies.ory_kratos_session;

  if (session) {
    const headers = {
      'Content-Type': 'application/json',
      Cookie: `${ORY_KRATOS_SESSION}=${session}`
    };

    const response = await fetch(`${KRATOS_URL}/sessions/whoami`, {
      headers
    });

    const body = (await response.json()) as Session;

    const authMethods = body.authentication_methods || [];

    const lastTotp = authMethods[authMethods.length - 1];

    if (!lastTotp || !lastTotp.completed_at) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const { completed_at } = lastTotp;

    const date = new Date(completed_at);

    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diff / 60000);

    if (diffMinutes > 3) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    return res.status(200).json({ message: 'Withdraw was successful' });
  }

  return res.status(401).json({ message: 'unauthorized' });
};
