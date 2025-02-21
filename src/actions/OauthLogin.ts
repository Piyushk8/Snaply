"use server"

import prisma from "@/lib/prisma"

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

     
}
