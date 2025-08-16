const DEFAULT_TIMEOUT_MS = 12_000;

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  { retries = 2, timeoutMs = DEFAULT_TIMEOUT_MS }: { retries?: number; timeoutMs?: number } = {}
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(t);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp;
    } catch (err) {
      clearTimeout(t);
      const isLast = attempt === retries;
      if (isLast) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1))); // backoff
    }
  }
}
