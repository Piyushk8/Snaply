"use server"

import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchmema } from "@/schemas"
import { AuthError } from "next-auth"

import * as z from "zod"

export const login = async(values:z.infer<typeof LoginSchmema>)=>{
    const validatedFields = LoginSchmema.safeParse(values)
    if(!validatedFields.success){
    return {
        error:"Invalid fields! " }
    }

    const {email,password } = validatedFields.data
    try {
        const userExists = await getUserByEmail(email)     
        if(!userExists) return {error:"User does not exist!"}
        const res = await signIn("credentials",{email,
            password,
            redirectTo:DEFAULT_LOGIN_REDIRECT})
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":   
                return { error:"Invalid Credentails! "}
                default:
                    console.log(error.cause)
                    return {error:"Something went wrong! "}
            }
        }
         
        throw error;
    }
}
