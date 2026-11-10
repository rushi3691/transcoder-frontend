import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { SignJWT, jwtVerify } from "jose";
import { JWT } from "next-auth/jwt";
import { AuthOptions } from "next-auth";

function getGoogleCredsFromEnv(): { clientId: string; clientSecret: string } {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (
    !googleClientId ||
    !googleClientSecret ||
    googleClientId === "" ||
    googleClientSecret === ""
  ) {
    throw new Error(
      "Missing Google Client ID or Google Client Secret. Please set them in your .env file."
    );
  }
  return { clientId: googleClientId, clientSecret: googleClientSecret };
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: getGoogleCredsFromEnv().clientId,
      clientSecret: getGoogleCredsFromEnv().clientSecret,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // Plain HS256 JWTs (same format jsonwebtoken produced, which the legacy CloudFront cookie check expects).
  // jose instead of jsonwebtoken: its dependency chain reads Buffer.SlowBuffer, removed in Node 25.
  jwt: {
    encode: async ({ secret, token, maxAge = 24 * 60 * 60 }) => {
      const now = Math.floor(Date.now() / 1000);
      return new SignJWT({ ...token })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(now)
        .setExpirationTime(now + maxAge)
        .sign(new TextEncoder().encode(secret as string));
    },
    decode: async ({ secret, token }) => {
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret as string), {
          algorithms: ["HS256"],
        });
        return payload as JWT;
      } catch {
        return null; // expired, tampered or signed with another secret -> no session
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account, session }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;

      return session;
    },
  },
  // *debug: true,
};
