'use client';

import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { kratos } from '../../../lib/kratos';
import { Card, Title } from '@tremor/react';
import { Container } from '../container';
import { LargeSkeleton } from '../../skeletons';
import { KratosUiNodesForm } from '../../kratos-ui-nodes-form';
import { useSettings } from '../../_hooks/useSettings';

export default function Page() {
  return <TwoAfa />;
}

interface IFormInputs {
  csrf_token: string;
  method: string;
  totp_code: string;
  totp_secret: string;
}

const TwoAfa = () => {
  const router = useRouter();
  const query = useSettings();

  const mutation = useMutation(
    ['update-settings-flow'],
    async (values: IFormInputs) => {
      if (!query.isSuccess) {
        return;
      }

      toast.loading('Verifying code...', {
        duration: 1000
      });

      await kratos.updateSettingsFlow({
        flow: query.data.id,
        updateSettingsFlowBody: values
      });
    },
    {
      onError: () => {
        toast.error('Something went wrong, please try again.');
      },
      onSuccess: () => {
        toast.success('Successfully added 2fa');
        router.push('/wallet');
      }
    }
  );

  if (query.isLoading) {
    return (
      <Container>
        <Card className={'sm:w-full md:w-[450px]'}>
          <LargeSkeleton />
        </Card>
      </Container>
    );
  }

  if (query.isError) {
    return (
      <Container>
        <p className={'text-rose-600 text-sm'}>
          Something went wrong, please try again.
        </p>
      </Container>
    );
  }

  if (query.isSuccess) {
    const nodes = query.data.ui.nodes.filter(
      (node) => node.group === 'totp' || node.group === 'default'
    );

    return (
      <Container>
        <Card className={'sm:w-full md:w-[450px]'}>
          <Title>Connect a 2FA app</Title>
          <KratosUiNodesForm
            nodes={nodes}
            onSubmit={(values: IFormInputs) => {
              mutation.mutate(values);
            }}
          />
        </Card>
      </Container>
    );
  }

  return null;
};
