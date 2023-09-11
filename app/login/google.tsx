'use client';

import { Button } from '@tremor/react';
import { useMutation, useQuery } from 'react-query';
import { kratos } from '../../lib/kratos';

export default function Google() {
  
  const query = useQuery(['create', 'login', 'flow'], async () => {
    const res = await kratos.createBrowserLoginFlow();
    return res.data;
  });
  
  const mutation = useMutation(
    async () => {
      if (!query.isSuccess) {
        return;
      }
      
      // @ts-ignore
      const crsfNode = query.data.ui.nodes.find(
        (node) => {
          if ('name' in node.attributes) {
            return node.attributes.name === 'csrf_token';
          }
        }
      );
      
      if (!crsfNode) {
        return;
      }
      
      // @ts-ignore
      await kratos.updateLoginFlow({
        flow: query.data.id,
        updateLoginFlowBody: {
          method: 'oidc',
          csrf_token: 'value' in crsfNode?.attributes ? crsfNode?.attributes.value : '',
          provider: 'google'
        }
      });
    }, {
      onError: (error) => {
        const err = error as any;
        const status = err.response?.status;
        if (status === 422) {
          const goto = err.response.data.redirect_browser_to;
          window.open(goto, '_self');
        }
      },
      retry: false
    }
  );
  
  
  return (
    <Button variant={'secondary'} className={'w-72'} onClick={
      () => {
        mutation.mutate();
      }
    }
    >
      <div className={'flex justify-start items-center w-64 gap-4'}>
        <img
          width={25}
          height={25}
          alt={'G'}
          src={'https://internal-backoffice.armenotech.dev/static/google-icon.cadee8cd.png'}
        />
        <span
          className={'mr-auto ml-auto'}
        >
              Continue with Google
            </span>
      </div>
    </Button>
  );
}