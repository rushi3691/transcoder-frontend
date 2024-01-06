// import "next-auth";
// import { DefaultSession } from "next-auth";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT, DefaultJWT} from "next-auth/jwt";
import type { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & { 
      id: string
    };
  }  
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}