import { useQuery } from 'react-query';
import { useState } from 'react';
import { kratos } from '../../lib/kratos';

export const useOidc = () => {
  const [flow, setFlow] = useState<string | undefined>(undefined);
  return useQuery(['use-oidc-flow'], async () => {
    if (flow) {
      const res = await kratos.getLoginFlow({
        id: flow
      });
      return res.data;
    } else {
      const res = await kratos.createBrowserLoginFlow();
      setFlow(res.data.id);
      return res.data;
    }
  });
};
