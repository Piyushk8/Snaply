import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req:NextRequest
  ,  {params}:{params:{postId:string}}) => {
   const {postId} = await params;
   
   try {
        const session = await auth();
        
        const cursor = req?.nextUrl?.searchParams.get("cursor") || undefined
        const pageSize = 10;
        const comments = await prisma.comments.findMany({
            where:{
                postId:postId
            },
            orderBy:{createdAt:"desc"},
            take:pageSize+1,
            cursor:cursor?{id:cursor} : undefined ,
            include:getCommentDataInclude(session?.user?.id)
        })
        console.log(comments)
        // const previousCursor = comments.length > pageSize ? comments[pageSize]?.id : null
        
        // const data:CommentPage= {
        //     comments:comments.length>pageSize ? comments.slice(1) : comments,
        //     previousCursor:previousCursor
        // }
        const nextCursor = comments.length > pageSize ? comments[pageSize]?.id : null

        const data:CommentPage = {
            nextCursor,
            comments:comments.length > pageSize ? comments.slice(0,pageSize) : comments
        }

        return NextResponse.json(data,{status:200})

   } catch (error) {
        console.log(error)
        return NextResponse.json({error},{status:500})
   }
}