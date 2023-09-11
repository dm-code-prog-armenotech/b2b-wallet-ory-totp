import { FrontendApi } from '@ory/kratos-client';

export const kratos = new FrontendApi({
  isJsonMime(mime: string): boolean {
    return mime === 'application/json' || mime === 'application/problem+json';
  },
  basePath: '/api/kratos'
});
