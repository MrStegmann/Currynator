/**
 * Analyzes the user's GitHub profile and returns comprehensive metrics.
 * @param forceRefresh - If true, bypasses local storage cache and forces a fresh network call.
 * @returns A promise resolving to the metrics object.
 */
export async function fetchGithubMetrics(forceRefresh = false): Promise<any> {
  const CACHE_KEY = 'github_metrics_cache';

  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached GitHub metrics', e);
      }
    }
  }

  const res = await (window as any).electronAPI.analyzeGithub();
  if (res && res.success) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
    return res.data;
  }
  throw new Error(res?.error || 'Failed to fetch GitHub metrics.');
}
