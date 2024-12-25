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
        async session({ session,trigger, token }) {
            // Fetch user data based on email or ID
            const user = await prisma.user.findUnique({
              where: { email: session.user.email },
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                profileComplete: true,
              }
            });
            
            // 2. Merge all user data at once
            session.user = {
              ...session.user,  // Keep existing session data
              ...user,          // Merge all database values
              isNewUser: token.isNewUser
            };
            
            // // 3. Handle token updates properly
            // if (trigger === "update" && session?.user) {
            //   console.log("trigerredddd")
            //   return {
            //     ...token,
            //     ...session.user  // Merge all session data into token
            //   };
            // }
           
           // console.log(session)
            return session; // Return updated session object
          },
          async jwt({ account,token,user ,session,trigger}) {
           
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