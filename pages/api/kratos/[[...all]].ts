import httpProxyMiddleware from 'next-http-proxy-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';

const KRATOS_URL = process.env.KRATOS_URL;

const kratos_url = KRATOS_URL || '';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => httpProxyMiddleware(req, res, {
  target: kratos_url,
  pathRewrite: {
    '/api/kratos': ''
  }
});