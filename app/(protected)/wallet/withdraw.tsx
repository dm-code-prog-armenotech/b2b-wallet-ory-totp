'use client';
import { useState } from 'react';
import { Button, Flex, Subtitle, TextInput, Title } from '@tremor/react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Modal } from '../../modal';
import { Verify2Fa } from '../../verify-2fa';
import { toast } from 'react-hot-toast';

export const Withdraw = () => {
  const [open, setOpen] = useState(false);

  const [has2fa, setHas2fa] = useState(false);

  const withdraw = async () => {
    const res = await fetch('/api/withdraw', {
      credentials: 'include'
    });

    if (!res.ok) {
      toast.error('Failed to withdraw funds');
    }

    toast.success('Successfully withdrew funds');
    setOpen(false);
  };

  return (
    <>
      <Button
        size="xs"
        variant="light"
        icon={ArrowRightIcon}
        iconPosition="right"
        onClick={() => setOpen(true)}
      >
        Withdraw
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <div className={'flex flex-col items-center justify-center p-8 gap-8'}>
          {has2fa ? (
            <>
              <Title className={'sm:w-full md:w-[400px] text-center'}>
                Withdraw funds from your wallet.
              </Title>
              <Subtitle>
                You have 3 minutes to complete the transaction. When this time
                expires, you will need to re-enter your 2FA code.
              </Subtitle>
              <Flex className={'gap-2'}>
                <TextInput className={'w-full'} placeholder={'Amount'} />
                <Button onClick={withdraw}>Withdraw</Button>
              </Flex>
            </>
          ) : (
            <>
              <Title className={'sm:w-full md:w-[400px] text-center'}>
                Please complete the 2FA verification to withdraw funds from your
                wallet.
              </Title>
              <Verify2Fa
                onSuccess={() => {
                  setHas2fa(true);
                }}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
