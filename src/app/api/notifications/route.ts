import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { getNotificationDataInclude, getUserDataSelect, NotificationPage, notificationsData } from "@/lib/types"
import { error } from "console"
import { NextRequest } from "next/server"

export async  function GET(
    req:NextRequest,
) {
    const cursor = req.nextUrl.searchParams.get('cursor') || null
    console.log(cursor) 
    const session = await auth()
    if(!session?.user) return new Error("No user found with this id")
    
    const pageSize = 10
    
    const notifications = await prisma.notifications.findMany({
        where:{
            recipientId:session?.user?.id
        },
        take:pageSize+1,
        orderBy:{createdAt:"desc"},
        cursor:cursor ? {id:cursor} : undefined,
        include:getNotificationDataInclude(session?.user?.id)
        
    });
    console.log(notifications)
    const nextCursor = notifications.length > pageSize ? notifications[pageSize]?.id : null

    const data:NotificationPage = {
        notifications:notifications.slice(0,pageSize),
        nextCursor
    }

    if(!notifications) return Response.json({
        error:"No notifications found for the user"
    },{status:400})

    return Response.json(data,{status:200})

 }


