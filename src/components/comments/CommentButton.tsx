"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PostData, userData } from "@/lib/types"
import { Loader2Icon, MessageSquare, SendHorizonal } from "lucide-react"
import UserTooltip from "../UserTooltip"
import Link from "next/link"
import ClientCldImage from "../CldImage"
import { formateRelativeDate } from "@/lib/utils"
import PostMoreButton from "../posts/PostMoreButton"
import Linkify from "../Linkify"
import { useSubmitCommentMutation } from "./mutations"
import { useState } from "react"

interface CommentButtonProps{
    post:PostData;
    user:userData,
    
}
//Dialog box for comment
export function CommentButton({ post, user }: CommentButtonProps) {
      const [input,setInput] = useState("")
      const [open, setOpen] = useState(false);

      const mutation = useSubmitCommentMutation(post.id);
      
      async function onSubmit(e: React.FormEvent) {
          e.preventDefault();
          if(!input) return;
          
          mutation.mutate({
              post,
              content: input
          }, {
              onSuccess: () => {
                  setInput("");
                  setOpen(false);
              }
          });
      }
     
      return (
          <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
         <div className="flex gap-[1px]">
         <MessageSquare className="size-5 text-gray-400" />
         <span>
            {post?._count?.comments}
        </span>
         </div>
        </DialogTrigger>
        <DialogHeader className="shadow-sm">
          <DialogTitle hidden></DialogTitle>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        
            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-3 relative">
                <div className="relative">
                  <UserTooltip user={post.user}>
                    <Link href={`/user/${post.user?.username}`} className="">
                      <ClientCldImage
                        src={post?.user?.image}
                        alt={`${post.user?.name}'s avatar`}
                        size={45}
                        // className="rounded-full"
                      />
                    </Link>
                  </UserTooltip>
                  {/* Connecting line */}
                  <div className="absolute left-1/2 top-full w-0.5 h-8 bg-gray-600 transform -translate-x-1/2"></div>
                </div>
                <div>
                  <UserTooltip user={post.user}>
                    <Link
                      href={`/user/${post.user?.username}`}
                      className="block font-medium hover:text-gray-300"
                    >
                      {post.user?.name}
                    </Link>
                  </UserTooltip>
                  <Link
                    href={`/posts/${post?.id}`}
                    className="block text-xs text-gray-500 hover:underline"
                  >
                    {formateRelativeDate(post.createdAt)}
                  </Link>
                </div>
              </div>
              {post.user?.id === user?.id && (
                <PostMoreButton
                  post={post}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </div>
            <div className="mt-4 ml-12">
              <Linkify>
                <div className="whitespace-pre-line break-words overflow-wrap-anywhere max-w-full overflow-hidden">
                  {post.content}
                </div>
              </Linkify>
              <DialogDescription className="text-sm text-blue-400 mt-2">
                replying to @{post?.user?.username}
              </DialogDescription>
            </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative">
              <ClientCldImage
                src={user?.image}
                alt="Your avatar"
                size={35}
                // className="rounded-full"
              />
              {/* Connecting line */}
              <div className="absolute left-1/2 bottom-full w-0.5 h-8 bg-gray-600 transform -translate-x-1/2"></div>
            </div>
              <form className='flex w-full items-center gap-2' onSubmit={onSubmit}>
                 <Input
                     placeholder='write a comment.'
                     value={input}
                     onChange={(e)=>setInput(e.target.value)}
                     autoFocus
                  />
                  <Button type='submit' variant={"ghost"} size={"icon"} disabled={!input.trim() || mutation.isPending}>
                   {
                     !mutation.isPending ? (
                         <SendHorizonal/>
                     )
                     :(
                         <Loader2Icon className='animate-spin'/>
                     )
                   }   
                  </Button>
             
               </form>
          </div>
          <DialogFooter className="mt-4">
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }