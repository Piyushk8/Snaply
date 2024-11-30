import * as z from "zod"

export const LoginSchmema = z.object({
    email: z.string().email({message:"Email Required"}),
    password:z.string({message:"password required"})
})
export const RegisterSchmema = z.object({
    name:z.string().min(1,{message:"Name Required!"}),
    email: z.string().email({message:"Email Required"}),
    password:z.string().min(6,{message:"Minimum 6 characters Required "})
})