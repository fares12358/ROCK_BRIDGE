/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // optional: keep an explicit i18n config (not required for the client-side context, but helpful)
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en'
  }
};

export default nextConfig;
