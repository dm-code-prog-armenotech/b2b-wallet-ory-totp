'use client';
import { useIdentities } from '../../_hooks/useIdentities';
import { ListLoader } from '../../skeletons';
import {
  Badge,
  Button,
  Card,
  Color,
  Flex,
  Subtitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title
} from '@tremor/react';
import { KratosUser } from './table';
import { useMutation } from 'react-query';
import { kratosAdmin } from '../../../lib/kratos';
import { toast } from 'react-hot-toast';

const colors: { [key: string]: Color } = {
  disabled: 'rose',
  active: 'emerald'
};

export const Users = () => {
  const identities = useIdentities();

  const linkMutation = useMutation(
    ['recovery-link'],
    async (id: string) => {
      const res = await kratosAdmin.createRecoveryCodeForIdentity({
        createRecoveryCodeForIdentityBody: {
          identity_id: id
        }
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.custom(
          (t) => (
            <Card className={'w-[400px] h-56'}>
              <Flex className={'justify-between mb-4'}>
                <Title>Recovery link created</Title>
                <Button
                  variant={'light'}
                  color={'gray'}
                  size={'xs'}
                  onClick={() => toast.dismiss(t.id)}
                >
                  Close
                </Button>
              </Flex>
              <div className={'flex flex-col gap-4'}>
                <div>
                  <Subtitle>Link</Subtitle>
                  <Text className={'text-sm'}>{data.recovery_link}</Text>
                </div>
                <div>
                  <Subtitle>Recovery code</Subtitle>
                  <Text className={'text-sm'}>{data.recovery_code}</Text>
                </div>
              </div>
            </Card>
          ),
          {
            duration: 30 * 1000
          }
        );
      }
    }
  );

  const resetMutation = useMutation(
    ['reset-2fa'],
    async (id: string) => {
      toast.loading(
        'Resetting 2fa, please wait. This may take a few seconds...',
        {
          duration: 2000
        }
      );
      const res = await kratosAdmin.deleteIdentityCredentials({
        id,
        type: 'totp'
      });
      return res.data;
    },
    {
      onSuccess: () => {
        toast.success('2fa reset successfully');
      },
      onError: () => {
        toast.error('Something went wrong, we were unable to reset 2Fa.');
      }
    }
  );

  if (identities.isLoading) {
    return <ListLoader />;
  }

  if (identities.isError) {
    return (
      <p className={'text-red-600 text-sm'}>
        Something went wrong, please try again.
      </p>
    );
  }

  if (identities.isSuccess) {
    console.log(identities);
    const users: KratosUser[] = identities.data.map((i) => ({
      id: i.id,
      email: i.traits.email,
      status: i.state!,
      name: i.traits.name?.first + ' ' + i.traits.name?.last,
      picture: i.traits.picture
    }));

    return (
      <div className={'px-2'}>
        <Flex justifyContent="start" className="space-x-2">
          <Title>Users</Title>
          <Badge color="gray">8</Badge>
        </Flex>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text className="mt-2">List of B2B Wallet users</Text>
        <Table className={'mt-6'}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge color={colors[user.status]} size="xs">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Flex justifyContent={'around'}>
                    <Button
                      size="xs"
                      variant="secondary"
                      color="gray"
                      onClick={() => linkMutation.mutate(user.id)}
                      loading={
                        linkMutation.isLoading &&
                        linkMutation.variables === user.id
                      }
                    >
                      Create recovery link
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      color="rose"
                      onClick={() => {
                        resetMutation.mutate(user.id);
                      }}
                      loading={
                        resetMutation.isLoading &&
                        resetMutation.variables === user.id
                      }
                    >
                      Reset 2FA
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return null;
};
