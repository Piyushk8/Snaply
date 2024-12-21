"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/types"
import { createPostSchema } from "@/lib/zodSchema"
import { error } from "console"


export async function SubmitPost(input:String) {
    const session =await auth()
    if(!session?.user || !session?.user?.id) throw Error("Please Login to post, NOT a valid user")

        const {content} = createPostSchema.parse({content:input})

        const post = await prisma.post.create({
            data:{
                content,
                userId:session.user.id

            },include:getPostDataInclude(session.user?.id)
        })
       if(post) return {post,success:"Post Created Successfully"}
        return {error :"Error uploading post ,Try again Later"}

        
    }
