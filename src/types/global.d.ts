interface Window {
  dataLayer: Record<string, unknown>[];
  pushDataLayer: (eventName: string, payload?: Record<string, unknown>) => void;
}
