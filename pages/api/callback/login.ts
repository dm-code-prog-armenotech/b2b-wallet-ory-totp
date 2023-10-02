import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '../../../lib/postgres';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body;

    const flow = payload.ctx.flow;

    if (flow.active !== 'totp') {
      return res.status(200).json({ message: 'Skipping' });
    }

    const id = flow.id;

    try {
      await sql`
          update withdraw_flows
          set verified = true
          where two_fa_flow_id = ${id}
            and expires_at > now()
      `;
    } catch (e) {
      console.log('[/api/callback/login] error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Success' });
  }

  return res.status(405);
};
