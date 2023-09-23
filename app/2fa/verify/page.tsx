'use client';
import { Verify2Fa } from '../../verify-2fa';
import { Container } from '../container';
import { useRouter } from 'next/navigation';

interface IFormInputs {
  csrf_token: string;
  method: string;
  totp_code: string;
}

export default function Page() {
  const router = useRouter();
  return (
    <Container>
      <Verify2Fa
        onSuccess={() => {
          router.push('/wallet');
        }}
      />
    </Container>
  );
}
