import { UiNode } from '@ory/kratos-client';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { Button, Subtitle } from '@tremor/react';
import { useOidc } from '../_hooks/useOidc';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { kratos } from '../../lib/kratos';
import { Skeleton } from '../skeletons';

interface IFormInputs {
  csrf_token: string;
  method: string;
  provider: string;
}

const onError = (error: any) => {
  const err = error as any;
  const status = err.response?.status;
  if (status === 422) {
    const goto = err.response.data.redirect_browser_to;
    window.open(goto, '_self');
  }
};

const Form = <T extends FieldValues>({
  nodes,
  onSubmit
}: {
  nodes: UiNode[];
  onSubmit: (values: T) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<T>();

  const Node = ({ node }: { node: UiNode }) => {
    if (
      node.type === 'input' &&
      'type' in node.attributes &&
      'name' in node.attributes
    ) {
      const label = node.meta.label?.text || '';
      const name = node.attributes.name as Path<T>;
      const inputType = node.attributes.type;
      const required = node.attributes.required;
      const bg = inputType === 'submit' ? 'bg-indigo-700' : 'bg-white';
      const color = inputType === 'submit' ? 'text-white' : 'text-gray-900';
      const cursor = inputType === 'submit' ? 'cursor-pointer' : '';
      const iv = node.attributes.value;
      const value = iv === '' ? undefined : iv;

      if (inputType === 'submit') {
        return (
          <>
            <input
              type="submit"
              hidden
              value={value}
              {...register(name, { required })}
            />
            <Button variant={'secondary'} className={'w-72'}>
              <div className={'flex justify-start items-center w-64 gap-4'}>
                <img
                  width={25}
                  height={25}
                  alt={'G'}
                  src={
                    'https://internal-backoffice.armenotech.dev/static/google-icon.cadee8cd.png'
                  }
                />
                <span className={'mr-auto ml-auto'}>{label}</span>
              </div>
            </Button>
          </>
        );
      } else {
        return (
          <div className={`flex flex-col gap-2 w-full`}>
            <Subtitle>{label}</Subtitle>
            <input
              value={value}
              {...register(name, { required })}
              type={inputType}
              className={`w-full h-10 px-4 rounded-xl ${bg} ${color} ${cursor} border-gray-200 border-2 outline-0 focus:border-indigo-500`}
            />
          </div>
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {nodes.map((node) => (
        // eslint-disable-next-line react/jsx-key
        <Node node={node} />
      ))}
    </form>
  );
};

export const NewGoogle = () => {
  const oidc = useOidc();
  const router = useRouter();

  const mutation = useMutation(
    ['mutate-google'],
    async (values: IFormInputs) => {
      if (!oidc.isSuccess) {
        return;
      }

      toast.loading('Redirecting to your provider');

      await kratos.updateLoginFlow({
        flow: oidc.data.id,
        updateLoginFlowBody: values
      });
    },
    {
      onError
    }
  );

  const onSubmit = (values: IFormInputs) => {
    mutation.mutate(values);
  };

  if (oidc.isFetching) {
    return <Skeleton />;
  }

  if (oidc.isError) {
    return (
      <p className={'text-red-600 text-sm'}>
        Something went wrong, please try again.
      </p>
    );
  }

  if (oidc.isSuccess) {
    const nodes = oidc.data.ui.nodes.filter(
      (node) => node.group === 'default' || node.group === 'oidc'
    );

    return (
      <div className={'flex flex-col gap-4'}>
        <Form<IFormInputs> nodes={nodes} onSubmit={onSubmit} />
      </div>
    );
  }

  return null;
};
