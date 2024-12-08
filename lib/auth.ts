import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, bearer, customSession, openAPI } from "better-auth/plugins";
import geoIp from "geoip-lite";

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Configures and initializes the authentication system using better-auth.
 *
 * - Uses Prisma as the database adapter with MySQL as the provider.
 * - Sets the application name to "Templates".
 * - Enables the admin, OpenAPI, and bearer plugins.
 * - Configures email and password authentication with auto sign-in and a maximum password length of 50 characters.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  appName: "Templates",
  emailAndPassword: { enabled: true, autoSignIn: true, maxPasswordLength: 50 },
  plugins: [
    admin(),
    openAPI(),
    bearer(),
    customSession(async ({ user, session }) => {
      let location = "Unknown location";
      if (session.ipAddress) {
        const res = geoIp.lookup(session.ipAddress);
        if (res) location = `${res.city} ${res.region} ${res.country}`;
      }
      return {
        user,
        session: {
          ...session,
          location: location || undefined,
        },
      };
    }),
  ],
});
