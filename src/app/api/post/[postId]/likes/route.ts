import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";
import { NextRequest } from "next/server";

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

    const post = await prisma.post.findUnique({
      where:{
        id:postId
      }
      ,select:{userId:true}
    })

    if(!post)  return Response.json(
      { error: "Post not found" },
      { status: 404 }
    );

    //transaction for Like creation then check for self --> Notification
    await prisma.$transaction([
       prisma.like.upsert({
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
    }),
    ...(post?.userId !== session?.user?.id ? [
       prisma.notifications.create({
        data:{
          recipientId:post?.userId,
          issuerId:session?.user?.id as string,
          type:"LIKE",
          postId:postId
  
        }
      })


    ]:[])

    ])
    
    return Response.json({ 
      message: "Like added successfully",
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

          const post = await prisma.post.findUnique({
            where:{
              id:postId
            }
            ,select:{userId:true}
          })
      
          if(!post)  return Response.json(
            { error: "Post not found" },
            { status: 404 }
          );
        
        await prisma.$transaction([
          prisma.like.delete({
           where:{
               userId_postId:{
                   userId:session?.user?.id,
                   postId:postId
               }},
          }),

          prisma.notifications.deleteMany({
            where:{issuerId:session?.user?.id,
              recipientId:post?.userId,
              postId,
              type:"LIKE"
            }
          })

        ])
          

         

            return new Response();
       } catch (err) {
            console.log(err)
            return Response.json({error:"Error occured"})        
       }
}