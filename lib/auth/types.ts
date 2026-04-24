// lib/auth/types.ts
export type User = {
  id: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export type AuthSession = {
  user: User
  session: {
    accessToken: string
    refreshToken: string
  }
}
