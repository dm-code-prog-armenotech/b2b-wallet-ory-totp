import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '../../../../lib/postgres';

// step 1 initiate the 2fa flow
// step 2 initiate the withdrawal flow by sending the payment requisites and the 2fa flow id
// step 3 pass the 2fa, a webhook will be called to confirm that the 2fa with this withdrawal flow id was successful
// step 4 confirm the withdrawal flow

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = JSON.parse(req.body);
    console.log(payload);

    const wid = payload.withdrawal_flow_id;
    if (!wid) {
      return res.status(400).json({
        message: 'Bad request, withdrawal_flow_id was not sent'
      });
    }

    const rows = await sql`
        select *
        from withdraw_flows
        where id = ${wid}
          and verified = true
          and expires_at > now()
    `;

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Withdraw was successful' });
    }

    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
