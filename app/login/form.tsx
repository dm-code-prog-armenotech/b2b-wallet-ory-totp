'use client';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NewGoogle } from './new_google';
import { QP } from '../query-provider';

export const Form = () => {
  return (
    <QP>
      <NewGoogle />
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </QP>
  );
};
