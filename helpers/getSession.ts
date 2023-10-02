import { NextApiRequest } from 'next';
import { Session } from '@ory/kratos-client';

const KRATOS_URL = process.env.KRATOS_URL;
const ORY_KRATOS_SESSION = 'ory_kratos_session';

/**
 * Get the current user session, shall be used only for logged-in users
 * otherwise it will throw an error
 * @param req {NextApiRequest}
 */
export const getSession = async (req: NextApiRequest): Promise<Session> => {
  const session = req.cookies.ory_kratos_session;
  if (!session)
    throw new Error('Session could not be found, Internal Server Error');

  const headers = {
    'Content-Type': 'application/json',
    Cookie: `${ORY_KRATOS_SESSION}=${session}`
  };

  const response = await fetch(`${KRATOS_URL}/sessions/whoami`, {
    headers
  });

  return (await response.json()) as Session;
};
