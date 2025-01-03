import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH() {
    
    try {
        const session = await auth();

        if(!session?.user) return Response.json({
            error:"unauthorized",
        },{status:400})

        await prisma.notifications.updateMany({
            where:{
                recipientId:session?.user?.id
                ,read:false
            },
            data:{
                read:true
            }
        })
    return new Response()

    } catch (error) {
        return Response.json({
            error:"Internal server error"
        },{status:500})
    }
}