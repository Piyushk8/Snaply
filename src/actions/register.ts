"use server"

import {RegisterSchmema} from "@/schemas"
import { error } from "console"
import bcrypt from "bcryptjs"
import * as z from "zod"
import { PrismaClient } from "@prisma/client"
import { getUserByEmail } from "@/data/user"

export const register = async(values:z.infer<typeof RegisterSchmema>)=>{
    const prisma = new PrismaClient()
    const validatedFields = RegisterSchmema.safeParse(values)
    if(!validatedFields.success){
    return {
        error:"Invalid fields! " }
    }
    const {email,password,name} = values
    const hashedPass = await bcrypt.hash(password,10)

    const existingUser = await getUserByEmail(email)
    
    if(existingUser) return {error :"Email already Exists!"}

    await prisma.user.create({
        data:{
            username:email.slice(0,5),
            name:name,
            email,
            password:hashedPass
        }
    })

    //Send User verification mail
    return { success:"User Created "}
}