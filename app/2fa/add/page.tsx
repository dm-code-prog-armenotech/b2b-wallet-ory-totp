'use client';

import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { kratos } from '../../../lib/kratos';
import { UiNode } from '@ory/kratos-client';
import { Card, Subtitle, Title } from '@tremor/react';
import { useForm } from 'react-hook-form';
import { Container } from '../container';
import { BallTriangle } from 'react-loader-spinner';

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

  const query = useQuery(
    ['add', '2fa'],
    async () => {
      const res = await kratos.createBrowserSettingsFlow();
      return res.data;
    },
    {
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  const mutation = useMutation(
    ['add', '2fa'],
    async (values: IFormInputs) => {
      if (!query.isSuccess) {
        return;
      }

      values['method'] = 'totp';

      await kratos.updateSettingsFlow({
        flow: query.data.id,
        updateSettingsFlowBody: values
      });

      toast.loading('Adding 2fa', { duration: 1000 });
    },
    {
      onError: (error: any) => {},
      onSuccess: () => {
        toast.success('Successfully added 2fa');
        router.push('/wallet');
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInputs>();

  const Node = ({ node }: { node: UiNode }) => {
    if (
      node.type === 'input' &&
      'type' in node.attributes &&
      'name' in node.attributes
    ) {
      const label = node.meta.label?.text || '';
      const name = node.attributes.name as keyof IFormInputs;
      const inputType = node.attributes.type;

      const bg = inputType === 'submit' ? 'bg-indigo-700' : 'bg-white';
      const color = inputType === 'submit' ? 'text-white' : 'text-gray-900';
      const cursor = inputType === 'submit' ? 'cursor-pointer' : '';

      return (
        <div className={`flex flex-col gap-4`}>
          <Subtitle>{label}</Subtitle>
          <input
            value={inputType === 'submit' ? 'Save' : node.attributes.value}
            {...register(name, { required: true })}
            type={inputType}
            className={` h-10 px-4 rounded-xl ${bg} ${color} ${cursor} border-indigo-500 border-2`}
          />
          {errors[name] && (
            <span className={'text-red-600 text-sm'}>
              This field is required
            </span>
          )}
        </div>
      );
    }

    if (
      node.type === 'img' &&
      'src' in node.attributes &&
      'width' in node.attributes &&
      'height' in node.attributes
    ) {
      const label = node.meta.label?.text || '';
      return (
        <div className={'flex flex-col gap-2 '}>
          <Subtitle>{label}</Subtitle>
          <img
            src={node.attributes.src}
            width={node.attributes.width}
            height={node.attributes.height}
          />
        </div>
      );
    }

    return null;
  };

  if (query.isLoading) {
    return (
      <Container>
        <BallTriangle color="#4338ca" height={80} width={80} />
      </Container>
    );
  }

  if (query.isError) {
    return <Container>Something went wrong...</Container>;
  }

  if (query.isSuccess) {
    const nodes = query.data.ui.nodes.filter(
      (node) => node.group === 'totp' || node.group === 'default'
    );

    return (
      <Container>
        <Card className={'sm:w-full md:w-[400px]'}>
          <Title>Connect a 2FA app</Title>
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className={'flex flex-col gap-6'}
          >
            {nodes.map((node) => {
              return <Node node={node} key={Math.random()} />;
            })}
          </form>
        </Card>
      </Container>
    );
  }

  return null;
};
