import { useMutation } from 'react-query';
import { kratos } from '../lib/kratos';
import { toast } from 'react-hot-toast';
import { Card, Divider, Title } from '@tremor/react';
import { KratosUiNodesForm } from './kratos-ui-nodes-form';
import { use2fa } from './_hooks/use2fa';
import ContentLoader from 'react-content-loader';
import { LargeSkeleton } from './skeletons';

interface IFormInputs {
  csrf_token: string;
  method: string;
  totp_code: string;
}

export const Verify2Fa = ({ onSuccess }: { onSuccess: () => void }) => {
  return (
    <Card className={'sm:w-full md:w-[450px]'}>
      <Title>Two Factor Authentication</Title>
      <Form onSuccess={onSuccess} />
    </Card>
  );
};

const Form = ({ onSuccess }: { onSuccess: () => void }) => {
  const twoAfa = use2fa();

  const mutation = useMutation(
    ['pass-2fa'],
    async (values: IFormInputs) => {
      if (!twoAfa.isSuccess) return;

      toast.loading('Verifying 2fa', { duration: 1000 });
      return await kratos.updateLoginFlow({
        flow: twoAfa.data.id,
        updateLoginFlowBody: values
      });
    },
    {
      onSuccess: () => {
        toast.success('Successfully passed 2fa');
        onSuccess?.();
      },
      onError: () => {
        toast.error('Something went wrong, please try again.');
      }
    }
  );

  const onSubmit = (values: IFormInputs) => {
    mutation.mutate(values);
  };

  if (twoAfa.isFetching) {
    return <LargeSkeleton />;
  }

  if (twoAfa.isError) {
    return (
      <p className={'text-red-600 text-sm'}>
        Something went wrong, please try again.
      </p>
    );
  }

  if (twoAfa.isSuccess) {
    const nodes = twoAfa.data.ui.nodes;
    const totpNodes = nodes.filter(
      (node) => node.group === 'totp' || node.group === 'default'
    );
    const lookUpSecretNodes = nodes.filter(
      (node) => node.group === 'lookup_secret' || node.group === 'default'
    );

    return (
      <>
        <KratosUiNodesForm nodes={totpNodes} onSubmit={onSubmit} />
        <Divider />
        <KratosUiNodesForm nodes={lookUpSecretNodes} onSubmit={onSubmit} />
      </>
    );
  }
};
