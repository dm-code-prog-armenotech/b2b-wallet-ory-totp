import { useSettings } from '../../_hooks/useSettings';
import { Flex, Title } from '@tremor/react';
import Link from 'next/link';
import { KratosUiNodesForm } from '../../kratos-ui-nodes-form';
import { useMutation } from 'react-query';
import { kratos } from '../../../lib/kratos';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { queryClient } from '../../query-provider';
import { SmallSkeleton } from '../../skeletons';

interface IFormInputs {
  csrf_token: string;
  method: string;
  lookup_secret_regenerate: boolean;
}

export const RecoveryCodes = () => {
  return (
    <div>
      <Title>Recovery codes</Title>
      <Flex alignItems={'start'} justifyContent={'start'} className={'p-2'}>
        <Codes />
      </Flex>
    </div>
  );
};

const Codes = () => {
  const settings = useSettings();
  const mutation = useMutation(
    ['update-recovery-codes'],
    async (values: IFormInputs) => {
      if (!settings.isSuccess) {
        return;
      }

      toast.loading('Updating', { duration: 1000 });
      return kratos.updateSettingsFlow({
        flow: settings.data.id,
        updateSettingsFlowBody: values
      });
    },
    {
      onSuccess: (data) => {
        toast.success('Successfully generated recovery codes');
        if (data) {
          queryClient.setQueryData(['use-settings-flow'], data.data);
        }
      }
    }
  );

  const MutationError = () => {
    if (mutation.isError) {
      if (mutation.error instanceof Error) {
        const e = mutation.error as AxiosError;
        if (e.response && e.response.status === 403) {
          return (
            <p className={'my-4 text-red-600'}>
              You need to{' '}
              <Link
                href={'/2fa/verify'}
                className={'text-blue-400 font-semibold'}
              >
                pass 2FA
              </Link>{' '}
              again in order to generate recovery codes.
            </p>
          );
        } else {
          return (
            <p className={'my-4 text-red-600'}>
              Something went wrong, please try again.
            </p>
          );
        }
      }
    }

    return null;
  };

  if (settings.isLoading) {
    return <SmallSkeleton />;
  }

  if (settings.isError) {
    return (
      <p className={'text-red-600 text-sm'}>
        Something went wrong, please try again.
      </p>
    );
  }

  if (settings.isSuccess) {
    const lookUpSecretNodes = settings.data.ui.nodes.filter(
      (node) => node.group === 'lookup_secret' || node.group === 'default'
    );

    return (
      <div className={'flex flex-col gap-2 w-full max-w-[400px]'}>
        <KratosUiNodesForm
          nodes={lookUpSecretNodes}
          onSubmit={(values: IFormInputs) => {
            mutation.mutate(values);
          }}
        />
        <MutationError />
      </div>
    );
  }

  return null;
};
