'use client';

import { QP } from '../../query-provider';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Card, Grid } from '@tremor/react';
import { RecoveryCodes } from './recovery-codes';
import { Profile } from './profile';
import { Totp } from './totp';

export const Settings = () => {
  return (
    <QP>
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6">
        <Card>
          <Profile />
        </Card>
        <Card className={'w-full'}>
          <Totp />
          <RecoveryCodes />
        </Card>
      </Grid>
    </QP>
  );
};
