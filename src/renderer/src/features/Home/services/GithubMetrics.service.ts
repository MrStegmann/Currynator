/**
 * Analyzes the user's GitHub profile and returns comprehensive metrics.
 * @returns A promise resolving to the metrics object.
 */
export async function fetchGithubMetrics(): Promise<any> {
  const res = await (window as any).electronAPI.analyzeGithub();
  if (res && res.success) {
    return res.data;
  }
  throw new Error(res?.error || 'Failed to fetch GitHub metrics.');
}
