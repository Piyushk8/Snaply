import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { error } from "console";
import { NextRequest } from "next/server";

export const GET =  async (req:NextRequest) => {
    
    try {
        
        const session = await auth();
        if(!session?.user) return Response.json({error:"unauthorized access"})

        const q = await req.nextUrl.searchParams.get("q") || ""
        const cursor = await req.nextUrl.searchParams.get("cursor")||undefined
        const searchQuery = q.split(" ").join(" & ")
        const pageSize = 10

        const users = await prisma.user.findMany({
            where:{
                NOT:{
                    id:session.user?.id
                },
                OR: [
                    { username: { contains: searchQuery, mode: "insensitive" } },
                    { name: { contains: searchQuery, mode: "insensitive" } },
                  ],
            },
            select:getUserDataSelect(session?.user?.id)
            ,orderBy:{name:"asc"},
            take:pageSize+1,
            cursor:cursor?{id:cursor}:undefined,
        });
        const nextCursor = users.length > pageSize ? users[pageSize]?.id : null
        
        const data={
            users:users.slice(0,pageSize),
            nextCursor:nextCursor
        }
        console.log(data)
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

    } catch (error) {
        return Response.json({error:"Internal server error"},{status:500})
    }
}