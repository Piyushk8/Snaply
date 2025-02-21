import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, POstPage } from "@/lib/types";
import { NextRequest } from "next/server";

export const GET =  async (req:NextRequest) => {
    
    try {
        
        const session = await auth();
        if(!session?.user) return Response.json({error:"unauthorized access"})

        const q = await req.nextUrl.searchParams.get("q") || ""
        const cursor = await req.nextUrl.searchParams.get("cursor")

        const searchQuery = q.split(" ").join(" & ")
        const pageSize = 10

        const posts = await prisma.post.findMany({
            where: searchQuery
              ? {
                  OR: [
                    { content: { search: searchQuery } },
                    { user: { username: { search: searchQuery } } }
                  ],
                }
              : {}, // If searchQuery is null, fetch all posts
            include: getPostDataInclude(session?.user?.id),
            orderBy: [
              { likes: { _count: "desc" } }, // Order by most liked posts first
              { createdAt: "desc" }, // Then order by newest posts
            ],
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
          });
        console.log(posts,q,cursor)
        const nextCursor = posts.length > pageSize ? posts[pageSize]?.id : null

        const data:POstPage={
            posts,
            nextCursor:nextCursor
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

    } catch (error) {
        return Response.json({error:"Internal server error"},{status:500})
    }
}