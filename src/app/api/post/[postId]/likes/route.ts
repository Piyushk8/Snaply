import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export async  function GET(req:NextRequest ,
    {params}:{params:{postId:string}}) {
    const {postId} =  params 
    try {
        const session = await auth()
        if(!session?.user) return Response.json({error:"Unauthorized user"},{status:404})
            
            const post = await prisma.post.findUnique({
                where:{id:postId},
                select:{
                    likes:{
                        where:{userId:session?.user?.id},
                        select:{userId:true}
                    }
                    ,_count:{
                        select:{
                            likes:true
                        }
                    }
                },
                
            })

            const data:LikeInfo={
                likes:post?._count.likes||0,
                isLikedByUser: !!post?.likes.length
            }

            if(!post) return Response.json({
                error:"Post not found"
            },{status:404})

       } catch (err) {
            console.log(err)
            return Response.json({error:"Error occured"})        
       }
    }
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = await params;
    
    if (!postId) {
      return Response.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized user" },
        { status: 401 }
      );
    }

    const like = await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
      create: {
        userId: session.user.id,
        postId: postId,
      },
      update: {},
    });

    return Response.json({ 
      message: "Like added successfully",
      like: like 
    });
    
  } catch (err) {
    console.error('Error in post likes route:', err);
    // Fixed the syntax error here - removed extra curly brace
    return Response.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}
export async  function DELETE(req:NextRequest ,
    {params}:{params:{postId:string}}) {
    const {postId} = await params 
    try {
        const session = await auth()
        if(!session?.user) return Response.json({error:"Unauthorized user"},{status:404})
            
           const like = await prisma.like.delete({
            where:{
                userId_postId:{
                    userId:session?.user?.id,
                    postId:postId
                }
            },

           })

         

            return new Response();
       } catch (err) {
            console.log(err)
            return Response.json({error:"Error occured"})        
       }
}