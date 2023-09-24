import { useQuery } from 'react-query';
import { kratosAdmin } from '../../lib/kratos';

export const useIdentities = () => {
  return useQuery(['identities'], async () => {
    const res = await kratosAdmin.listIdentities();
    return res.data;
  });
};
