const ADMIN_TOKEN_KEY = 'admin_token'
const ADMIN_USER_KEY = 'admin_user'

export function isAdminAuthenticated() {
  return !!localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAdminUser(user) {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}