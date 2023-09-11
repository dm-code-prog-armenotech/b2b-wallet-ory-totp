import httpProxyMiddleware from 'next-http-proxy-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => httpProxyMiddleware(req, res, {
  target: 'https://kratos-totp-demo.fly.dev',
  pathRewrite: {
    '/api/kratos': ''
  },
  followRedirects: true
});