import { Card } from '@tremor/react';
import { Users } from './users';
import { QP } from '../../query-provider';

export interface KratosUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  status: string;
}

export const TableOfUsers = () => {
  return (
    <Card>
      <QP>
        <Users />
      </QP>
    </Card>
  );
};
