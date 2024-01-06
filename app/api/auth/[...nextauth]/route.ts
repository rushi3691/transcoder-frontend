import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { authOptions } from "./auth";

// function getGoogleCredsFromEnv(): { clientId: string; clientSecret: string } {
//   const googleClientId = process.env.GOOGLE_CLIENT_ID;
//   const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

//   if (
//     !googleClientId ||
//     !googleClientSecret ||
//     googleClientId === "" ||
//     googleClientSecret === ""
//   ) {
//     throw new Error(
//       "Missing Google Client ID or Google Client Secret. Please set them in your .env file."
//     );
//   }
//   return { clientId: googleClientId, clientSecret: googleClientSecret };
// }

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: getGoogleCredsFromEnv().clientId,
//       clientSecret: getGoogleCredsFromEnv().clientSecret,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 24 hours
//   },

//   jwt: {
//     encode: async ({ secret, token, maxAge }) => {
//       // console.log("token: ", token);

//       const encodedToken = jwt.sign(token as Object, secret, {
//         expiresIn: maxAge,
//       });

//       return encodedToken;
//     },
//     decode: async ({ secret, token }) => {
//       if (token === undefined) {
//         return null;
//       }
//       const verify = jwt.verify(token, secret) as JWT | string;

//       if (typeof verify === "string") {
//         return null;
//       }

//       return verify;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET!,
//   cookies: {
//     sessionToken: {
//       name: "next-auth.session-token",
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: true,
//       },
//     },
//   },
//   callbacks: {
//     async jwt({ token, user, account, session }) {
//       const dbUser = await prisma.user.findUnique({
//         where: {
//           email: token.email!,
//         },
//       });

//       console.log("account: ", account);
//       if (!dbUser) {
//         token.id = user!.id;
//         return token;
//       }

//       return {
//         id: dbUser.id,
//         name: dbUser.name,
//         email: dbUser.email,
//         picture: dbUser.image,
//       };
//     },
//     async session({ session, token, user }) {
//       session.user.id = token.id;
//       session.user.name = token.name;
//       session.user.email = token.email;
//       session.user.image = token.picture;

//       return session;
//     },
//   },
//   // *debug: true,
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
