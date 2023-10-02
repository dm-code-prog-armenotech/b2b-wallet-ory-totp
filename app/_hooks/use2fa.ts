import { useState } from 'react';
import { useQuery } from 'react-query';
import { kratos } from '../../lib/kratos';

export const use2fa = (fid?: string) => {
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);
  const [flow, setFlow] = useState<string | undefined>(fid);

  return useQuery(
    ['use-2fa', { needRefresh, flow }],
    async () => {
      if (flow) {
        const res = await kratos.getLoginFlow({
          id: flow
        });
        return res.data;
      } else {
        const res = await kratos.createBrowserLoginFlow({
          refresh: needRefresh,
          aal: 'aal2'
        });
        setFlow(res.data.id);
        return res.data;
      }
    },
    {
      retry: false,
      onError: () => {
        setNeedRefresh(true);
      }
    }
  );
};
