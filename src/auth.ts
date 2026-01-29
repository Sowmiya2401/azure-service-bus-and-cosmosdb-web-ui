import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { getEnv } from "./lib/env"

const allowedUsername = getEnv("AUTH_USERNAME", "AUTH-USERNAME") || getEnv("ADMIN_USERNAME", "ADMIN-USERNAME")
const allowedPassword = getEnv("AUTH_PASSWORD", "AUTH-PASSWORD") || getEnv("ADMIN_PASSWORD", "ADMIN-PASSWORD")

console.log("Auth config:", {
  AUTH_USERNAME: process.env.AUTH_USERNAME,
  AUTH_PASSWORD_SET: !!process.env.AUTH_PASSWORD,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const username = credentials?.username
                const password = credentials?.password

                console.log("Auth attempt:", {
                    username,
                    passwordSet: !!password,
                    allowedUsername,
                    allowedPasswordSet: !!allowedPassword,
                })

                if (!allowedUsername || !allowedPassword) {
                    return null
                }

                if (username === allowedUsername && password === allowedPassword) {
                    return { id: "1", name: "Admin", email: "admin@azure.local" }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    // Fallback to a hardcoded secret if env vars are missing (for debugging purposes only)
    secret: getEnv("AUTH_SECRET", "AUTH-SECRET") || getEnv("NEXTAUTH_SECRET", "NEXTAUTH-SECRET") || "fallback-secret-for-debugging-only",
})
