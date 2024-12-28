import { MediaType } from '@prisma/client'
import {array, object,string,z} from 'zod'


export  const signInSchema = object({
    email:string ({required_error:"Email is required"})
        .min(1,"Email is required")
        .email("Invalid email")
        ,
        password: string({required_error:"Password is required"})
        .min(1,"Password is required")
        .min(8,"Password must be more than 8 characters")
        .max(32,'password must be less than 32 characters')
})

export const createPostSchema = object({
    content:string({required_error:"No content provided"}),
    media:array(object({
        publicId:string()
        ,type:string()
        })).max(5,"cannot have more than 5 attachments")
})

export const updateUserProfileSchema = object({
    name:string({required_error:"name required"}),
    bio:string().max(1000,"Must be less than 1000 characters")
})

export type updateUserProfileValues = z.infer<typeof updateUserProfileSchema>