'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useRecovery } from '../_hooks/useRecovery';
import { Skeleton } from '../skeletons';
import { KratosUiNodesForm } from '../kratos-ui-nodes-form';
import { kratos } from '../../lib/kratos';
import { queryClient } from '../query-provider';
import { toast } from 'react-hot-toast';

interface IFormInputs {
  csrf_token: string;
  method: 'code';
  code: string;
}

export const Form = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams?.get('flow');
  const recovery = useRecovery(flow);

  const mutation = useMutation(
    ['update-recovery-flow'],
    async (values: IFormInputs) => {
      toast.loading('Verifying code...', { duration: 1000 });

      const res = await kratos.updateRecoveryFlow({
        flow: flow as string,
        updateRecoveryFlowBody: values
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Code verified');
        queryClient.setQueryData(['use-recovery-flow'], data);
        router.push('/settings');
      }
    }
  );

  if (recovery.isFetching) {
    return <Skeleton />;
  }

  if (recovery.isError) {
    return (
      <p className={'text-sm text-rose-600'}>
        Something went wrong, please try again later.
      </p>
    );
  }

  if (recovery.isSuccess) {
    const nodes = recovery.data.ui.nodes;

    return (
      <div className={'flex flex-col gap-4'}>
        <KratosUiNodesForm
          nodes={nodes}
          onSubmit={(values: IFormInputs) => {
            mutation.mutate(values);
          }}
        />
      </div>
    );
  }

  return null;
};
