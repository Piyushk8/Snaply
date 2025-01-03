import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
   
    try {
         
    const session = await auth();

    if(!session?.user) return new Error("unauthorized")

    const count = await prisma.notifications.count({
        where:{
            recipientId:session?.user?.id
            ,read:false
        }
    })
    
        return Response.json({
            unreadCount:count
        },{status:200})

    } catch (error) {
        return new Error("internal server error")
    }

    
}