'use client';
import { useState } from 'react';
import { Button, Flex, Subtitle, TextInput, Title } from '@tremor/react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Modal } from '../../modal';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { kratos } from '../../../lib/kratos';
import { Verify2Fa } from '../../verify-2fa';

interface IFormInputs {
  bank_account: string;
  amount: string;
}

export const Withdraw = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFaFlowId, setTwoFaFlowId] = useState<string | null>(null);
  const [withdrawalFlowId, setWithdrawalFlowId] = useState<string | null>(null);
  const [completed2fa, setCompleted2fa] = useState(false);
  const { register, handleSubmit } = useForm<IFormInputs>();

  const initiateWithdrawal = async (data: IFormInputs) => {
    setLoading(true);

    const loginFlow = await kratos.createBrowserLoginFlow({
      aal: 'aal2',
      refresh: true
    });

    const tfaId = loginFlow.data.id;
    setTwoFaFlowId(tfaId);

    const res = await fetch('/api/v2/withdraw/initiate', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        ...data,
        two_fa_flow_id: tfaId
      })
    });

    if (!res.ok) {
      toast.error('Failed to initiate the withdrawal flow');
    } else {
      const responseBody = await res.json();
      toast.success(responseBody.message, {
        duration: 12000
      });
      setWithdrawalFlowId(responseBody.flow_id);
    }

    setLoading(false);
  };

  const confirmWithdrawal = async () => {
    setLoading(true);

    const res = await fetch('/api/v2/withdraw/confirm', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        withdrawal_flow_id: withdrawalFlowId
      })
    });

    if (!res.ok) {
      toast.error('The withdrawal failed, please try again later');
    } else {
      const responseBody = await res.json();
      toast.success(responseBody.message, {
        duration: 12000
      });
    }

    setLoading(false);
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
        <div className={'flex flex-col items-center justify-center p-8 gap-4'}>
          <Title className={'sm:w-full md:w-[400px] text-center'}>
            Withdraw funds from your wallet.
          </Title>
          {withdrawalFlowId && (
            <Subtitle>
              You have 5 minutes to confirm the withdrawal. When this time
              passed, you will need to provide your requisites and initiate the
              withdrawal again.
            </Subtitle>
          )}
          <Flex className={'gap-2'}>
            <form
              className={'flex flex-col gap-4 w-full'}
              onSubmit={handleSubmit(initiateWithdrawal)}
            >
              <div>
                <Subtitle>Bank Account</Subtitle>
                <TextInput
                  {...register('bank_account')}
                  className={'w-full'}
                  placeholder={'xxxx-xxxx-xxxx-xxxx'}
                  disabled={loading || !!withdrawalFlowId}
                />
              </div>
              <div>
                <Subtitle>Amount</Subtitle>

                <TextInput
                  {...register('amount')}
                  className={'w-full'}
                  placeholder={'1,000,000 $'}
                  disabled={loading || !!withdrawalFlowId}
                />
              </div>
              {!withdrawalFlowId && !twoFaFlowId && (
                <Button
                  loading={loading}
                  className={'w-48 my-2'}
                  color={'indigo'}
                >
                  Confirm
                </Button>
              )}
            </form>
          </Flex>
          {withdrawalFlowId && twoFaFlowId && !completed2fa && (
            <div className={'mt-4'}>
              <Verify2Fa
                onSuccess={() => {
                  setCompleted2fa(true);
                }}
                fid={twoFaFlowId}
              />
            </div>
          )}

          {completed2fa && (
            <Button
              className={'mt-2'}
              color={'indigo'}
              onClick={confirmWithdrawal}
              loading={loading}
            >
              Confirm Withdrawal
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};
