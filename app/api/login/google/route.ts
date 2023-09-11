import { NextResponse } from 'next/server';
import { FrontendApi } from '@ory/kratos-client';

export const GET = async () => {
  
  const client = new FrontendApi({
    isJsonMime(mime: string): boolean {
      return mime === 'application/json' || mime === 'application/problem+json';
    },
    basePath: 'https://kratos-totp-demo.fly.dev'
  });
  
  return NextResponse.json({
    message: 'Hello from the API'
  });
};