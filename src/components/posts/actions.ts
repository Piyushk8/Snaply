"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/types"

export const deletePost = async (id:string) => {
    const session = await auth()

    if(!session?.user) throw Error("Unauthorized")

    const post = await prisma.post.findUnique({
        where:{
            id
        }
    })

     if(!post) throw Error("Post doesnt exists")

     if(post.userId!==session?.user.id) throw Error("UnAuthorized!")
    
    const deletedPost = await prisma.post.delete({
        where:{id}
        ,include:postDataInclude
    })

    return deletedPost;

        }