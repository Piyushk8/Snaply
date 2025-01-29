"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { error } from "console"
import { useRouter } from "next/router"

import { NextResponse } from "next/server"

import * as z from "zod"

interface ProfileSchema{
    email:string,
    userName:string,
    bio?:string
    image?:string
}


export const OauthLogin = async(values:ProfileSchema)=>{
    
    const {email, userName,bio,image} = values
    if(!userName) return {error:"Enter a Username"}

    //Ensure the username is unique
    const existingUserName = await prisma.user.findUnique({
      where: { username:userName },
    });
  
    if (existingUserName) {
      //return NextResponse.json({ error: "Username already exists try another one!" }, { status: 400 });
      return {error:"Username Already Exists!"}
    }
  
    // Create the user with additional fields
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        username:userName,
        bio,
        image,
        profileComplete:true
      },
    });
    return {success:"Profile Completed!"}
    
    //return NextResponse.json({ user: newUser }, { status: 200 });
     
}
