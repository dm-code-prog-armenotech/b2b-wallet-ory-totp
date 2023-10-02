import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '../../../lib/postgres';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body;

    const flow = payload.ctx.flow;

    if (flow.active !== 'totp') {
      return res.status(200);
    }

    const id = flow.id;

    await sql`
        update withdraw_flows
        set verified = true
        where two_fa_flow_id = ${id}
          and expires_at > now()
    `;

    return res.status(200);
  }

  return res.status(405);
};
