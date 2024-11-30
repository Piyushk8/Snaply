import { auth } from "@/auth";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function  Home() {
  const session = await auth()
  // console.log("home",session)
  if(!session?.user?.profileComplete) redirect(`/profile?email=${encodeURIComponent(session?.user.email)}`)
    
    const posts = await prisma.post.findMany({
      orderBy:{createdAt:"desc"},
      include:{user:{
        select:{
          id:true,
          username:true,
          name:true,
          image:true

        }
      }}
      
    })
    
    return (
    <main className="gap-5 flex bg-red-100 w-full min-w-0 ">
      <div className="w-full mb-3 min-w-0 space-y-5 ">
        <PostEditor/>
        {
          posts.map((data)=>{
            return <>
            <Post key={data.id} post={data}></Post>
            </>
          })
        }
      </div>
      <TrendsSidebar/>
    </main>
  );
}
