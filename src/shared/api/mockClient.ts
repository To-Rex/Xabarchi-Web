/**
 * Mock transport layer. Every feature repository goes through `simulate`,
 * so swapping in a real HTTP client later only touches the repositories —
 * never the UI.
 */

export interface SimulateOptions {
  /** Latency window in ms. Defaults to a realistic 350–750ms. */
  minDelay?: number
  maxDelay?: number
  /** Probability [0..1] of a simulated network failure. Defaults to 0. */
  failRate?: number
  failMessage?: string
}

export class MockApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockApiError'
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function simulate<T>(produce: () => T, options: SimulateOptions = {}): Promise<T> {
  const { minDelay = 350, maxDelay = 750, failRate = 0, failMessage = 'Network error' } = options
  await delay(minDelay + Math.random() * (maxDelay - minDelay))
  if (failRate > 0 && Math.random() < failRate) {
    throw new MockApiError(failMessage)
  }
  return produce()
}
