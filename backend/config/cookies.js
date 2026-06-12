import config from '../config/config.js';

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: config.NOVE_ENV === "production" ? "none" : "lax",
  secure: config.NODE_ENV ==='production' ? true : false,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// local development
// export const REFRESH_COOKIE_OPTIONS = {
//   httpOnly: true,         // Cookie can't be read by frontend JavaScript.
//   sameSite: "lax",       // Same-site is fine because frontend and backend are proxied through Vite.
//   secure: false,          // Keep false for local HTTP development.
//   //  path: "/api/auth",     // Only send cookie for auth routes.
//   path: "/",     // Make cookie available site-wide so refresh requests always include it.
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// };
