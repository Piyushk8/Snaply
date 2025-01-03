"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { getCommentDataInclude, PostData } from "@/lib/types"

interface submitCommentProps{
    post:PostData,
    content:string
}


export const submitComment =  async ({post,content}:submitCommentProps) => {
    
    const session = await auth()

    if(!session?.user) return null
    const newComment = await prisma.comments.create({
        data:{
            postId:post?.id,
            content:content,
            userId:session?.user?.id
        },
        include:getCommentDataInclude(session?.user?.id)
    })


    if(!newComment) return {error:"cannot post try gain later"}

    return {success:'comment posted',newComment}

}

export const deleteComment = async(commentId:string)=>{

   try {
    const session = await auth()
    if(!session?.user) throw new Error("unauthorized access")

   const deletedComment = await prisma.comments.delete({
    where:{
        id:commentId
    },
    include:getCommentDataInclude(session?.user?.id)
   })
    
    if(!deletedComment) throw new Error("comment deletion failed")
        
    return {success:"Comment Deleted",deletedComment}
   } catch (error) {
        throw new Error("comment deletion failed")
   }

}
interface editCommentProps{
    commentId:string,
    content:string,
    
}

export const editComment = async({commentId,content}:editCommentProps)=>{
   
    try {
        const session = await auth()
        if(!session?.user) throw new Error("unauthorized access")
    
            const updatedComment = await prisma.comments.update({
                where:{
                    id:commentId,
                },
                data:{
                    content:content
                },
                include:getCommentDataInclude(session?.user?.id)
            })
        
        if(!updatedComment) throw new Error("comment deletion failed")
            
        return {success:"Edit Successfully",updatedComment}
       } catch (error) {
            throw new Error("Edit comment failed")
       }
    
}