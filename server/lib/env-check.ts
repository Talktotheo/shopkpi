export function envCheck() {
  const required = ['CACHE_TTL_SECONDS'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) console.warn(`[env] Missing: ${missing.join(', ')}`);
}
