"use client"

import Link from 'next/link'
import { PostData } from '@/lib/types'
import { cn, formateRelativeDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import UserTooltip from '../UserTooltip'
import ClientCldImage from '../CldImage'
import LikeButton from './LikeButton'
import BookmarkButton from './BookmarkButton'
import { CommentButton } from '../comments/CommentButton'
import { useRouter } from 'next/navigation'
import { MediaCarousel } from '../comments/mediaCarousal'
import { Share2 } from 'lucide-react'


interface PostProps{
    post:PostData
}


const Post = ({post}:PostProps) => {

    const router = useRouter()
    const {data:session} = useSession()      
      return (
        <article
        className="group/post space-y-3 bg-card rounded-2xl p-5 shadow-sm hover:bg-slate-50 relative"
        onClick={() => router.push(`/post/${post?.id}`)} // Fallback navigation for empty spaces
      >
        {/* Overlay link to navigate to the post page */}
        <Link
          href={`/post/${post?.id}`}
          className=""
          aria-hidden="true"
        ></Link>
      
        {/* Upper Icons div */}
        <div
          className="flex justify-between gap-3 "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-wrap gap-3 ">
            <UserTooltip user={post?.user}>
              <Link href={`/user/${post?.user?.username}`} className="">
                <ClientCldImage
                  src={post?.user?.image || "/Avatars/ggmswp9zqo3za87f9npu"}
                  alt=""
                  size={45}
                  classname=""
                />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={post?.user}>
                <Link
                  href={`/user/${post?.user?.username}`}
                  className="block font-medium hover:text-gray-700"
                >
                  {post.user?.name}
                </Link>
              </UserTooltip>
              <Link
                href={`/post/${post?.id}`}
                className="block text-xs text-muted-foreground hover:underline-offset-8"
              >
                {formateRelativeDate(post?.createdAt)}
              </Link>
            </div>
          </div>
          {post?.user?.id === session?.user?.id && (
           <div onClick={(e) => e.stopPropagation()}>
               <PostMoreButton
                  post={post}
                  className="opacity-0 transition-opacity group-hover/post:opacity-100"
                  />
           </div>
          )}
        </div>
      
        {/* Content div */}
        <Linkify>
          <div className="pl-10 md:pl-16 w-full whitespace-pre-line break-words ">
            {post.content}
            <div>
              {/* {post?.attachments.length > 0 && (
                <MediaPreviews attachments={post.attachments} />
              )} */}
             {post?.attachments?.length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-2"
              >
                <MediaCarousel mediaItems={post.attachments}/>
              </div>
)}
            </div>
          </div>
        </Linkify>
      
        {/* Action buttons */}
        <div
          className="flex justify-around text-sm text-gray-600 "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center hover:bg-slate-100 rounded-full p-1">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post?._count?.likes,
                isLikedByUser: post?.likes.some(
                  (l) => l.userId === session?.user?.id
                ),
              }}
            />
          </div>
          <div className="flex items-center gap-[1px] hover:bg-slate-100 rounded-full p-1">
            <CommentButton post={post} user={session?.user} />
          </div>
          <div className="flex items-center hover:bg-slate-100 rounded-full p-1">
            <BookmarkButton
              initialState={{
                isBookMarkedByUser: post.bookmarks.some(
                  (i) => i.userId === session?.user?.id
                ),
              }}
              postId={post.id}
            />
          </div>
          <div className="flex items-center hover:bg-slate-100 rounded-full p-1">
            <Share2 size={20} color="lightgray" />
          </div>
        </div>
      </article>
      
    
  )
}
export default Post

