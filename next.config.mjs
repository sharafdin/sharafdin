import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    images: {
        domains: ['avatars.githubusercontent.com', 'raw.githubusercontent.com', 'www.yonode.org'], // Add other domains if needed
      },
};

export default withNextIntl(withMDX(nextConfig));