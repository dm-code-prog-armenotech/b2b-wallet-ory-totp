import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { kratos } from '../lib/kratos';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { UiNode } from '@ory/kratos-client';
import { Card, Subtitle, Title } from '@tremor/react';
import { BallTriangle } from 'react-loader-spinner';

interface IFormInputs {
  csrf_token: string;
  method: string;
  totp_code: string;
}

export const Verify2Fa = ({ onSuccess }: { onSuccess: () => void }) => {
  const [refresh, setRefresh] = useState(false);

  const query = useQuery(
    [refresh, '2fa'],
    async () => {
      const res = await kratos.createBrowserLoginFlow({
        aal: 'aal2',
        refresh: refresh
      });
      return res.data;
    },
    {
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      onError: () => {
        setRefresh(!refresh);
      }
    }
  );

  const mutation = useMutation(
    ['send', 'verify', '2fa'],
    async (values: IFormInputs) => {
      if (!query.isSuccess) {
        return;
      }

      values['method'] = 'totp';

      toast.loading('Verifying 2fa', { duration: 1000 });

      await kratos.updateLoginFlow({
        flow: query.data.id,
        updateLoginFlowBody: values
      });
    },
    {
      onSuccess: () => {
        toast.success('Successfully passed 2fa');
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error('Something went wrong, please try again.');
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
      const required = node.attributes.required;
      const bg = inputType === 'submit' ? 'bg-indigo-700' : 'bg-white';
      const color = inputType === 'submit' ? 'text-white' : 'text-gray-900';
      const cursor = inputType === 'submit' ? 'cursor-pointer' : '';

      const value =
        name === 'method' ? 'Send' : node.attributes.value || undefined;

      return (
        <div className={`flex flex-col gap-4`}>
          <Subtitle>{label}</Subtitle>
          <input
            value={value}
            {...register(name, { required })}
            type={inputType}
            className={` h-10 px-4 rounded-xl ${bg} ${color} ${cursor} border-indigo-500 border-2`}
          />
        </div>
      );
    }

    return null;
  };

  if (query.isLoading) {
    return <BallTriangle color="#4338ca" height={80} width={80} />;
  }

  if (query.isError) {
    return 'Something went wrong, please try again.';
  }

  if (query.isSuccess) {
    return (
      <Card className={'sm:w-full md:w-[400px]'}>
        <Title>Two Factor Authentication</Title>
        <form
          className={'flex flex-col gap-2'}
          onSubmit={handleSubmit((values) => {
            mutation.mutate(values);
          })}
        >
          {query.data.ui.nodes.map((node) => (
            <Node key={Math.random()} node={node} />
          ))}
        </form>
      </Card>
    );
  }
};
