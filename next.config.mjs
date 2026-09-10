/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/intake.html", destination: "/intake", permanent: false }];
  },
};

export default nextConfig;
