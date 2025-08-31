// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// import type { NextConfig } from "next";
// import withPWA from "next-pwa";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   disable: process.env.NODE_ENV === "development", // ✅ disable in dev

// };

// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
// })(nextConfig);







// // next.config.js (or next.config.ts if using TypeScript)
// import type { NextConfig } from "next";
// import withPWAInit from "next-pwa";
// import runtimeCaching from 'next-pwa/cache';

// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // ✅ Disable in dev
// });

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
// };

// export default withPWA(nextConfig);







// // next.config.ts
// import type { NextConfig } from "next";
// import withPWAInit from "next-pwa";
// import runtimeCaching from "next-pwa/cache";

// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   runtimeCaching, // ✅ Add this line
//   disable: process.env.NODE_ENV === "development",
// });

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
// };

// export default withPWA(nextConfig);








// import type { NextConfig } from "next";
// import withPWAInit from "next-pwa";

// const runtimeCaching = [
//   {
//     urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
//     handler: "CacheFirst",
//     options: {
//       cacheName: "google-fonts-webfonts",
//       expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
//     },
//   },
//   {
//     urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
//     handler: "StaleWhileRevalidate",
//     options: {
//       cacheName: "google-fonts-stylesheets",
//     },
//   },
//   {
//     urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
//     handler: "StaleWhileRevalidate",
//     options: {
//       cacheName: "images",
//       expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
//     },
//   },
//   {
//     urlPattern: /\.(?:js|css)$/i,
//     handler: "StaleWhileRevalidate",
//     options: { cacheName: "static-resources" },
//   },
// ];

// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   runtimeCaching, // ✅ now typed properly
//   disable: process.env.NODE_ENV === "development",
// });

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
// };

// export default withPWA(nextConfig);





import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest\.json$/], // ✅ skip file that doesn't exist
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
