// types/next-auth.d.ts
import { Prisma } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      profileComplete: boolean; // Add your custom field here
      // Add other fields as necessary
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    profileComplete: boolean; // Add your custom field here
    // Add other fields as necessary
  }

  interface JWT {
    id: string;
    username?: string;
    profileComplete: boolean; // Add your custom field here
    // Add other fields as necessary
  }
}
