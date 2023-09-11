/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  rewrites: async () => [
    {
      source: '/kratos',
      destination: 'https://kratos-totp-demo.fly.dev'
    }]
};

module.exports = nextConfig;
