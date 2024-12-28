
import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYourFeed from "./ForYourFeed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FollowingFeed from "./followingFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default async function  Home() {
  const session = await auth()
  console.log("home",session)
  if(!session?.user?.profileComplete) redirect(`/profile?email=${encodeURIComponent(session?.user.email)}`)
   
  
    return (
    <main className="gap-5 flex  w-full min-w-0 ">
      <div className="w-full mb-3 min-w-0 space-y-5 ">
        <PostEditor/>
        {/* {
          <div>
            <Button>Following</Button>
            <Button>For you</Button>
          </div>
        } */}
        <Tabs className="" defaultValue="for-you">
          <TabsList className=" w-full selection:bg-black bg-transparent">
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYourFeed/>
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed/>
          </TabsContent>
        </Tabs>
       </div>
      <TrendsSidebar/>
    </main>
  );
}
