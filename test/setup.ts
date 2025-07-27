import { vi } from 'vitest'

// Mock DOM APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
})

// Mock requestIdleCallback
Object.defineProperty(window, 'requestIdleCallback', {
  value: vi.fn().mockImplementation((callback: Function) => {
    return setTimeout(() => callback({ timeRemaining: () => 50 }), 0)
  }),
  writable: true,
})

// Mock cancelIdleCallback
Object.defineProperty(window, 'cancelIdleCallback', {
  value: vi.fn().mockImplementation((id: number) => {
    clearTimeout(id)
  }),
  writable: true,
})

// Mock Worker
Object.defineProperty(window, 'Worker', {
  value: class MockWorker {
    onmessage: ((event: MessageEvent) => void) | null = null
    onerror: ((event: ErrorEvent) => void) | null = null

    constructor(public url: string) {}

    postMessage(data: any) {
      // Mock worker response
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { data: { success: true, data: {} } }))
        }
      }, 0)
    }

    terminate() {}
  },
  writable: true,
})

// Mock performance.memory
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
  writable: true,
})

// Mock document for CSS injection tests
Object.defineProperty(global, 'document', {
  value: {
    head: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    createElement: vi.fn().mockReturnValue({
      setAttribute: vi.fn(),
      remove: vi.fn(),
      textContent: '',
    }),
    documentElement: {
      setAttribute: vi.fn(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
  },
  writable: true,
})
