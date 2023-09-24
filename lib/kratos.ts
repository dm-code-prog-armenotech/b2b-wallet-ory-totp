import { FrontendApi, IdentityApi } from '@ory/kratos-client';

export const kratos = new FrontendApi({
  isJsonMime(mime: string): boolean {
    return mime === 'application/json' || mime === 'application/problem+json';
  },
  basePath: '/api/kratos'
});

export const kratosAdmin = new IdentityApi({
  isJsonMime(mime: string): boolean {
    return mime === 'application/json' || mime === 'application/problem+json';
  },
  basePath: '/api/admin/kratos'
});
