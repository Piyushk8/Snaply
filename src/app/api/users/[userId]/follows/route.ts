import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import {Session} from "next-auth";
import { NextRequest } from "next/server";

export const GET= async(req:NextRequest
    ,{params}:{params:{userId:string}}
) => {
    const  {userId} = await params
    try {
        const session= await auth()
        const userSession = session as Session &{user:{id:string}}
        if(!userSession?.user) return Response.json({
            error:"Unauthorized user"
        },{status:401})

        const user = await prisma.user.findUnique({
            where:{id:userId},
            select:{
                followers:{
                    where:{
                        followerId:session?.user?.id
                    },
                    select:{
                        followerId:true
                    }
                },_count:{
                    select:{
                        followers:true
                    }
                }
            }
        })
        if(!user) return Response.json({error:"User not found"},{status:404})

        const data:FollowerInfo = {
            followers:user._count.followers,
            isFollowedByUser:!!user.followers.length
        }
        return data

        
        // const user = await prisma.follow.findUnique({
        //     where:{
        //         followerId:userSession.user.id ,
        //         followingId:userId
        //     }
        // })

    } catch (error) {
        console.error(error)
        return Response.json({
            error:"Internal Server error"},{status:500}
        )
    }
    
    
}


export async function POST(req:Request,
    {params}:{params:{userId:string}}
) {
    try {
        const {userId} = await params
       
        const session= await auth()
        const userSession = session as Session &{user:{id:string}}
        if(!userSession?.user) return Response.json({
            error:"Unauthorized user"
        },{status:401})

        const result = await prisma.$transaction([
             prisma.follow.upsert({
                where:{
                   followerId_followingId:{
                    followerId:userSession.user.id,
                    followingId:userId
                   }
                },
                create:{
                    followerId:userSession.user.id,
                    followingId:userId
                },
                update:{}
            }),
            
            prisma.notifications.create({
                data:{
                    type:"FOLLOW",
                    issuerId:userSession?.user?.id,
                    recipientId:userId
                }
            })
        ])
       
        
      return new Response()
    } catch (error) {
        console.error(error)
        return Response.json({
            error:"Internal Server error"},{status:500}
        )
    }
}

export async function DELETE(req:Request,
    {params}:{params:{userId:string}}
) {
    try {
        const {userId} = await params
        const session= await auth()
        const userSession = session as Session &{user:{id:string}}
        if(!userSession?.user) return Response.json({
            error:"Unauthorized user"
        },{status:401})

      const result = await prisma.$transaction([
         prisma.follow.deleteMany({
            where:{
                followerId:userSession.user.id,
                followingId:userId
            }
        }),
        prisma.notifications.deleteMany({
            where:{
                type:"FOLLOW",
                issuerId:userSession?.user?.id,
                recipientId:userId
            }
        })
      ])

      return new Response()
    } catch (error) {
        console.error(error)
        return Response.json({
            error:"Internal Server error"},{status:500}
        )
    }
}

