import { useMutation } from 'react-query';
import { useSettings } from '../../_hooks/useSettings';
import { Divider, Flex, Title } from '@tremor/react';
import { kratos } from '../../../lib/kratos';
import { KratosUiNodesForm } from '../../kratos-ui-nodes-form';
import { toast } from 'react-hot-toast';
import { queryClient } from './settings';
import { Skeleton } from '../../skeletons';

interface IFormInputs {
  csrf_token: string;
  method: string;
}

export const Totp = () => {
  return (
    <div>
      <Title>Two Factor Authentication</Title>
      <Flex alignItems={'start'} justifyContent={'start'} className={'p-2'}>
        <Form />
      </Flex>
      <Divider />
    </div>
  );
};

const Form = () => {
  const settings = useSettings();

  const mutation = useMutation(
    ['update-totp'],
    async (values: IFormInputs) => {
      if (!settings.isSuccess) {
        return;
      }

      return kratos.updateSettingsFlow({
        flow: settings.data.id,
        updateSettingsFlowBody: values
      });
    },
    {
      onSuccess: (data) => {
        if (data) {
          toast.success('Settings were updated');
          queryClient.setQueryData(['use-settings-flow'], data.data);
        }
      }
    }
  );

  if (settings.isLoading) {
    return <Skeleton />;
  }

  if (settings.isError) {
    return (
      <p className={'text-red-600 text-sm'}>
        Something went wrong, please try again.
      </p>
    );
  }

  if (settings.isSuccess) {
    const nodes = settings.data.ui.nodes.filter(
      (node) => node.group === 'totp' || node.group === 'default'
    );
    return (
      <div className={'flex flex-col gap-2 w-full max-w-[400px]'}>
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
