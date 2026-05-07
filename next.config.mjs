/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  /**
   * Logistics-template legacy routes are redirected away from the Kapture Care
   * surface. The page files still exist in the repo (carry-over from the
   * Logistics template) but visiting them now returns a 308 to the Care
   * equivalent. Delete the page files in a future cleanup pass.
   */
  async redirects() {
    return [
      // Make `/` the kooper · care front door
      { source: "/", destination: "/kooper-care-landing.html", permanent: false },
      // Old logistics-template URLs that may still be cached / linked from old SEO
      { source: "/quote", destination: "/contact", permanent: true },
      { source: "/services", destination: "/apps", permanent: true },
      { source: "/state-of-uk-logistics-2026", destination: "/", permanent: true },
      { source: "/request-audit", destination: "/contact", permanent: true },
      { source: "/careers", destination: "/about", permanent: true },
      { source: "/careers/:slug", destination: "/about", permanent: true },
      { source: "/careers/apply/:slug", destination: "/contact", permanent: true },
    ];
  },
  /**
   * Rewrites — clean URL aliases for the kooper · care static prototypes in /public/.
   * Visit /care-plans and the deployed site serves /kooper-care-plans.html.
   */
  async rewrites() {
    return [
      { source: "/sign-in-demo", destination: "/kooper-sign-in.html" },
      { source: "/dashboards",   destination: "/kooper-care-dashboards.html" },
      { source: "/care-plans",   destination: "/kooper-care-plans.html" },
      { source: "/clinical",     destination: "/kooper-clinical.html" },
      { source: "/recording",    destination: "/kooper-recording-demo.html" },
      { source: "/reports",      destination: "/kooper-reports.html" },
      { source: "/resident",     destination: "/kooper-resident.html" },
      { source: "/family",       destination: "/kooper-family.html" },
      { source: "/hr",           destination: "/kooper-hr.html" },
      { source: "/apps",         destination: "/kooper-apps.html" },
      { source: "/app-detail",   destination: "/kooper-app.html" },
    ];
  },
};

export default nextConfig;
