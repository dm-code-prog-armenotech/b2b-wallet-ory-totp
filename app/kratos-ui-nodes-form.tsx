import type { FieldValues, Path } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { UiNode } from '@ory/kratos-client';
import { Button, Subtitle } from '@tremor/react';

export const KratosUiNodesForm = <T extends FieldValues>({
  nodes,
  onSubmit
}: {
  nodes: UiNode[];
  onSubmit: (arg0: T) => void;
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
            <Button color={'indigo'} className={'w-64 my-2'}>
              {label}
            </Button>
            {errors[name] && (
              <span className={'text-red-600 text-sm'}>
                This field is required
              </span>
            )}
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
            {errors[name] && (
              <span className={'text-red-600 text-sm'}>
                This field is required
              </span>
            )}
          </div>
        );
      }
    }

    if (
      node.type === 'img' &&
      'src' in node.attributes &&
      'width' in node.attributes &&
      'height' in node.attributes
    ) {
      const label = node.meta.label?.text || '';
      return (
        <div className={'flex flex-col gap-2 w-full'}>
          <Subtitle>{label}</Subtitle>
          <img
            src={node.attributes.src}
            width={node.attributes.width}
            height={node.attributes.height}
          />
        </div>
      );
    }

    if (
      node.type === 'text' &&
      'text' in node.attributes &&
      'text' in node.attributes.text
    ) {
      const label = node.meta.label?.text || '';
      return (
        <div className={'flex flex-col gap-2 w-full'}>
          <Subtitle>{label}</Subtitle>
          <i>{node.attributes.text.text}</i>
        </div>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col gap-4'}>
      {nodes.map((node) => (
        // eslint-disable-next-line react/jsx-key
        <Node node={node} />
      ))}
    </form>
  );
};
