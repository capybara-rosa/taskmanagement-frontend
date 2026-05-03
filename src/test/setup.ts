import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// confirm() is used by the delete handler — default to true in tests
Object.defineProperty(window, 'confirm', { writable: true, value: vi.fn(() => true) })

// localStorage shim (jsdom provides one, but ensure it's clean between tests)
beforeEach(() => localStorage.clear())
