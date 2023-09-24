import { useState } from 'react';
import { useQuery } from 'react-query';
import { kratos } from '../../lib/kratos';

export const useSettings = () => {
  const [flow, setFlow] = useState<string | undefined>(undefined);

  return useQuery(['use-settings-flow'], async () => {
    if (flow) {
      const res = await kratos.getSettingsFlow({
        id: flow
      });
      return res.data;
    }

    const res = await kratos.createBrowserSettingsFlow();
    setFlow(res.data.id);
    return res.data;
  });
};
