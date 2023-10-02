import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../../helpers/getSession';
import { sql } from '../../../../lib/postgres';

import { randomUUID } from 'crypto';

// step 1 initiate the 2fa flow
// step 2 initiate the withdrawal flow by sending the payment requisites and the 2fa flow id
// step 3 pass the 2fa, a webhook will be called to confirm that the 2fa with this withdrawal flow id was successful
// step 4 confirm the withdrawal flow

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession(req);

    try {
      const payload = JSON.parse(req.body);
      const { amount, bank_account, two_fa_flow_id } = payload;

      const user_id = session.identity.id;

      if (!amount || !bank_account || !two_fa_flow_id) {
        return res.status(400).json({ message: 'Bad request' });
      }

      const flowId = randomUUID();

      try {
        await sql`
            insert into withdraw_flows (id, user_id, amount, bank_account, two_fa_flow_id)
            values (${flowId},
                    ${user_id},
                    ${amount},
                    ${bank_account},
                    ${two_fa_flow_id})
        `;
      } catch (e) {
        console.log('[/api/v2/withdraw/initiate] error', e);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(200).json({
        message:
          'Initiated withdrawal flow, please pass the two factor verification to confirm the withdrawal',
        flow_id: flowId
      });
    } catch (e) {
      console.log('[/api/v2/withdraw/initiate] error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
