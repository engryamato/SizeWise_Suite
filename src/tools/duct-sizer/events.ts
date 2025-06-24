import { AirDuctSizer, DuctCalculationResult } from './logic';

type EventCallback = (result: DuctCalculationResult) => void;

class AirDuctSizerEvents {
  private subscribers: Set<EventCallback> = new Set();
  private lastResult: DuctCalculationResult | null = null;

  // Subscribe to calculation results
  subscribe(callback: EventCallback): () => void {
    this.subscribers.add(callback);

    // Immediately notify with last result if available
    if (this.lastResult) {
      callback(this.lastResult);
    }

    // Return unsubscribe function
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers of a new calculation result
  private notify(result: DuctCalculationResult): void {
    this.lastResult = result;
    this.subscribers.forEach(callback => callback(result));
  }

  // Handle calculation request
  calculate(ductSizer: AirDuctSizer): DuctCalculationResult {
    const result = ductSizer.calculate();
    this.notify(result);
    return result;
  }

  // Reset the last result and notify subscribers
  reset(): void {
    this.lastResult = null;
    this.notify(null as any);
  }
}

// Export a singleton instance
export const airDuctSizerEvents = new AirDuctSizerEvents();

// Event types for better type safety
export const AIR_DUCT_EVENTS = {
  CALCULATION: 'calculation',
  RESET: 'reset',
  ERROR: 'error',
} as const;
