import { useQuery } from 'react-query';
import { kratos } from '../../lib/kratos';

export const useRecovery = (id: string | null | undefined) => {
  return useQuery(['use-recovery-flow'], async () => {
    if (id) {
      const res = await kratos.getRecoveryFlow({
        id
      });
      return res.data;
    } else {
      throw new Error('The url was malformed, recovery flow id was not found');
    }
  });
};
