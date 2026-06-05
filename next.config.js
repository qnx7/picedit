/** @type {import('next').NextConfig} */

// When building for GitHub Pages the site is served from /<repo>, so we need
// a basePath. Locally (and on Vercel) GITHUB_PAGES is unset → no prefix.
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repo = 'picedit';

const nextConfig = {
  // Produce a fully static site in ./out so it can be hosted on GitHub Pages.
  output: 'export',
  // next/image optimization needs a server; disable it for static hosting.
  images: { unoptimized: true },
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',
  // GitHub Pages serves folders, so emit /page/index.html style URLs.
  trailingSlash: true,
};

module.exports = nextConfig;
