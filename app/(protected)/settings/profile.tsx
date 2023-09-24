import { Flex, Title } from '@tremor/react';
import { useSettings } from '../../_hooks/useSettings';
import { KratosUiNodesForm } from '../../kratos-ui-nodes-form';
import { LargeSkeleton } from '../../skeletons';

interface IFormInputs {
  csrf_token: string;
  method: string;
  'traits.email': string;
  'traits.name.first': string;
  'traits.name.last': string;
  'traits.picture': string;
}

export const Profile = () => {
  return (
    <div>
      <Title>Profile</Title>
      <Flex alignItems={'start'} justifyContent={'start'} className={'p-2'}>
        <ProfileForm />
      </Flex>
    </div>
  );
};

const ProfileForm = () => {
  const settings = useSettings();

  if (settings.isLoading) {
    return <LargeSkeleton />;
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
      (node) => node.group === 'profile' || node.group === 'default'
    );

    return (
      <div className={'flex flex-col gap-2 w-full max-w-[400px]'}>
        <KratosUiNodesForm
          nodes={nodes}
          onSubmit={(values: IFormInputs) => {
            // mutation.mutate(values);
          }}
        />
      </div>
    );
  }

  return null;
};
