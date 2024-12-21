import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { error } from "console";
import { DefaultSession ,Session} from "next-auth";
import { NextRequest } from "next/server";
// interface Session extends DefaultSession {
//     user: {
//       id: string; // Add the id property here
//       // Add any other properties you want to include
//     } & DefaultSession["user"]; // Keep existing properties from DefaultSession
//   }
export const GET= async(req:NextRequest
    ,{params}:{params:{userId:string}}
) => {
    const  {userId} = await params
    try {
        console.log(userId)
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
        console.log(user)
        if(!user) return Response.json({error:"User not found"},{status:404})

        const data:FollowerInfo = {
            followers:user._count.followers,
            isFollowedByUser:!!user.followers.length
        }
        return 

        
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
        console.log(userId)
        const session= await auth()
        const userSession = session as Session &{user:{id:string}}
        if(!userSession?.user) return Response.json({
            error:"Unauthorized user"
        },{status:401})

        const result = await prisma.follow.upsert({
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
        }) 
        console.log(result)
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

        await prisma.follow.deleteMany({
            where:{
                followerId:userSession.user.id,
                followingId:userId
            }
        })

      return new Response()
    } catch (error) {
        console.error(error)
        return Response.json({
            error:"Internal Server error"},{status:500}
        )
    }
}

