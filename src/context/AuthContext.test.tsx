import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function TestConsumer() {
  const { isAuthenticated, token, logout } = useAuth()
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="token">{token ?? 'none'}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('reports unauthenticated when no token is in localStorage', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth')).toHaveTextContent('no')
    expect(screen.getByTestId('token')).toHaveTextContent('none')
  })

  it('reports authenticated when a token exists in localStorage', () => {
    localStorage.setItem('token', 'test-jwt')
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth')).toHaveTextContent('yes')
    expect(screen.getByTestId('token')).toHaveTextContent('test-jwt')
  })

  it('clears authentication state after logout', () => {
    localStorage.setItem('token', 'test-jwt')
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    act(() => screen.getByRole('button', { name: /logout/i }).click())
    expect(screen.getByTestId('auth')).toHaveTextContent('no')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('throws when useAuth is used outside AuthProvider', () => {
    const consoleError = console.error
    console.error = () => {}
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider')
    console.error = consoleError
  })
})
