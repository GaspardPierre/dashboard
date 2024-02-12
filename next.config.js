/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cloudflare-ipfs.com',"avatars.githubusercontent.com" /* autres domaines si nécessaire */],
      },
};

module.exports = nextConfig;
