import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function GET(){

    try {
    const session = await auth() 
    if( !session?.user ) return Response.json({error:"Unauthorized acces"},{status:401})

        const posts = await prisma.post.findMany({
            orderBy:{createdAt:"desc"},
            include:postDataInclude
          })
          return Response.json({posts})
    } catch (error) {
     return Response.json({error:"Internal Server Error!"},{status:500})   
    }
}