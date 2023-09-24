'use client';
import { Card, Title } from '@tremor/react';
import { Form } from './form';
import { QP } from '../query-provider';

export default function Page() {
  return (
    <QP>
      <div
        className={
          'w-full h-[90%] flex flex-col items-center justify-center bg-gray-100 '
        }
      >
        <Card
          className={
            'w-full sm:w-[450px] flex flex-col gap-6 items-center p-12'
          }
        >
          <Title>Account recovery</Title>
          <Form />
        </Card>
      </div>
    </QP>
  );
}
