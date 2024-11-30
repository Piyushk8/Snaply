import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter} from "@auth/prisma-adapter"
import prisma from "./lib/prisma"
import { error } from "console"
import { getUserByEmail } from "./data/user"
//console.log(process.env.AUTH_SECRET)
export const {
    handlers:{GET,POST} ,auth,signIn,signOut
} = NextAuth({
    adapter:PrismaAdapter(prisma) as any,
    session:{strategy:"jwt"},
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async session({ session, token }) {
            // Fetch user data based on email or ID
            const user = await prisma.user.findUnique({
              where: { email: session.user.email },
            });
           // console.log(user)
            if (user) {
              // Add custom fields to session.user
              session.user.id = user.id; // Add user ID
              session.user.profileComplete = user.profileComplete; // Add profileComplete field
              session.user.isNewUser = token.isNewUser
            }
           // console.log(session)
            return session; // Return updated session object
          },
          async jwt({ account,token,user }) {
            if (account && user?.email) {
                // Check if the user is new during sign-in
                const existingUser = await prisma.user.findUnique({
                  where: { email: user.email },
                });
          
                token.isNewUser = !existingUser; // Attach isNewUser flag
              }
              return token
          },
       
      
        async signIn({ user, account, profile, credentials }) {
            // Custom logic to manage sign-in flow
            //console.log("signin called",user,account,profile,credentials)
            if (account?.provider === "google" || account?.provider === "github") {
                // For OAuth providers
                if(!user?.email) return false
                 const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser?.profileComplete && existingUser) {
                    console.log("Complete Profile!")
                    // Redirect new OAuth users to a profile completion form
                    return `/profile?email=${encodeURIComponent(user.email)}`;
                }
            } else if (account?.provider === "credentials") {
                // For custom credentials
                if (!user) {
                    // If no user was returned from authorize
                    return false; // Reject sign-in
                }
            }

            return true; // Allow sign-in for valid users
        },
        
        
    }
,
  ...authConfig
})