import type { AuthResponse, CreateAccountInput, LoginInput, WorkspaceUser } from '~/types'

import { api } from '~/api'

const tokenKey = 'oksbi-access-token'

export function useAuth() {
  const user = useState<WorkspaceUser | null>('auth-user', () => null)
  const token = useState<string | null>('auth-token', () => null)
  const ready = useState<boolean>('auth-ready', () => false)
  const pending = useState<boolean>('auth-pending', () => false)
  const error = useState<string | null>('auth-error', () => null)

  async function applyAuth(response: AuthResponse) {
    user.value = response.user
    token.value = response.token
    if (import.meta.client) {
      window.localStorage.setItem(tokenKey, response.token)
    }
  }

  async function ensureSession() {
    if (ready.value || pending.value) {
      return
    }

    pending.value = true
    error.value = null

    try {
      const currentUser = await api.getCurrentUser()
      if (currentUser) {
        const storedToken = import.meta.client ? window.localStorage.getItem(tokenKey) ?? '' : ''
        await applyAuth({ user: currentUser, token: storedToken })
      }
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Unable to initialize your session.'
    } finally {
      pending.value = false
      ready.value = true
    }
  }

  async function login(input: LoginInput) {
    pending.value = true
    error.value = null
    try {
      const response = await api.login(input)
      await applyAuth(response)
      ready.value = true
      return response
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Login failed.'
      throw caughtError
    } finally {
      pending.value = false
    }
  }

  async function createAccount(input: CreateAccountInput) {
    pending.value = true
    error.value = null
    try {
      const response = await api.createAccount(input)
      await applyAuth(response)
      ready.value = true
      return response
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Account creation failed.'
      throw caughtError
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    pending.value = true
    error.value = null
    try {
      await api.logout()
      user.value = null
      token.value = null
      if (import.meta.client) {
        window.localStorage.removeItem(tokenKey)
      }
    } finally {
      pending.value = false
      ready.value = true
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    ready: readonly(ready),
    pending: readonly(pending),
    error: readonly(error),
    ensureSession,
    login,
    createAccount,
    logout
  }
}