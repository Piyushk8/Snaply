import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs"
import Credentials from 'next-auth/providers/credentials'
import type {NextAuthConfig} from "next-auth"
import { LoginSchmema } from "./schemas";
import { getUserByEmail } from "./data/user";
import { redirect } from "next/navigation";

export default {
    providers:[
        GitHub({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            //@ts-expect-error
            async authorize(credentials){
                const validatedFields = LoginSchmema.safeParse(credentials);
                if(validatedFields.success){
                    const { email,password} = validatedFields.data
                    
                    const user = await getUserByEmail(email)
                    if(!user || !user.password) return null
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    )
                    if(passwordMatch) return user;
                } 
            } 
        })
    ],
    events: {
        async signIn({ user, account, isNewUser }) {
          // Check if this is a new user
          if (isNewUser && user?.email) {
            // Fetch user data to check for profile completeness
            const existingUser = await getUserByEmail(user.email)
            // Check if the profileComplete field is false or undefined
            if (existingUser && !existingUser.profileComplete) {
              // Redirect to profile completion page
              redirect('/profile-completion'); // Adjust this URL as needed
            }
          }
        },
      },
    
    
} satisfies NextAuthConfig