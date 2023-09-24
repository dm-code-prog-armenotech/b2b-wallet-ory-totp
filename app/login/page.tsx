import { Card, Title } from '@tremor/react';
import { Form } from './form';

export default function Page() {
  return (
    <div
      className={
        'w-full h-[90%] flex flex-col items-center justify-center bg-gray-100 '
      }
    >
      <Card
        decoration={'top'}
        decorationColor={'indigo'}
        className={'w-full sm:w-[450px] flex flex-col gap-6 items-center p-12'}
      >
        <Title className={'font-bold text-3xl text-center'}>
          Welcome here, please sign in.
        </Title>
        <Form />
      </Card>
    </div>
  );
}
