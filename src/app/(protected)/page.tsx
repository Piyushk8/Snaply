

import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYourFeed from "../ForYourFeed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function  Home() {
  const session = await auth()
  console.log("home",session)
  if(!session?.user?.profileComplete) redirect(`/profile?email=${encodeURIComponent(session?.user.email)}`)
    
    return (
    <main className="gap-5 flex  w-full min-w-0 ">
      <div className="w-full mb-3 min-w-0 space-y-5 ">
        <PostEditor/>
        <ForYourFeed/>
      </div>
      <TrendsSidebar/>
    </main>
  );
}
