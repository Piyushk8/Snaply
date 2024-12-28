"use client"

import Link from 'next/link'
import { UserAvatar } from '../User-Avatar'
import { PostData } from '@/lib/types'
import { cn, formateRelativeDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import UserTooltip from '../UserTooltip'
import { CldImage } from 'next-cloudinary'
import AvatarPlaceholder from "@/lib/businessman-character-avatar-isolated_24877-60111.jpg"
import ClientCldImage from '../CldImage'
import { Media } from '@prisma/client'
import Image from 'next/image'
import VideoCard from '../VideoCard'
import { SubmitPost } from './editor/action'
import { Bookmark, HeartIcon, Share, Share2 } from 'lucide-react'
import { FaComment, FaComments, FaRegComment, FaRegComments } from 'react-icons/fa'
import LikeButton from './LikeButton'
import BookmarkButton from './BookmarkButton'

interface PostProps{
    post:PostData
}
// export interface Video {
  
//   publicId: string
//   originalSize: number
//   duration: number
//   }


const Post = ({post}:PostProps) => {
    const {data:session} = useSession()

    //SubmitPost({content:"helo",publicIds:["jdks","emkeek","snwkms","smkma"]})
    // const video: Video = {
    //     publicId: 'Attachments/attachment_6263e36f-000d-498a-baf4-c7d344918b8f',
    //     originalSize: 2146615, // Bytes
    //     duration: 60.433333, // Seconds
    //     };
    // const handleDownload = (url: string, title: string) => {
    //   console.log(`Downloading ${title} from ${url}`);
 
    // }
      
      
      return (
          <article className='group/post space-y-3 bg-card rounded-2xl p-5 shadow-sm'>
{/* Upper Icons div */}
        <div className='flex  justify-between gap-3'>
            <div className='flex flex-wrap gap-3 '>
                <UserTooltip user={post.user}>
                <Link href={"/"} className=''>
                    
                    {/* <UserAvatar image={post.user?.image}/> */}
                   <ClientCldImage src={post?.user?.image} alt='' size={45} classname={""}/>
                </Link>
                </UserTooltip>
                <div>
                    <UserTooltip user={post.user}>   
                    <Link href={`/user/${post.user?.username}`}
                        className='block font-medium hover:text-gray-700'
                        >
                    {post.user?.name}
                    </Link>
                    </UserTooltip>
                    <Link href={`posts/${post?.id}`} 
                        className='block text-xs  text-muted-foreground hover:underline-offset-8 '
                        >
                        {formateRelativeDate(post.createdAt)}
                    </Link>
                </div>
            </div>
            {
                post.user?.id === session?.user?.id && (
                    <PostMoreButton post={post} className='opacity-0 transition-opacity group-hover/post:opacity-100' />
                )
            }
        </div>
    {/* content div     */}
    <Linkify>
        <div className="ml-16 whitespace-pre-line break-words">
            {post.content}
            <div>
                <MediaPreviews attachments={post.attachments}/>
            </div>
        </div>
    </Linkify>

    <div className='flex justify-around'>
        <div className='flex items-center'>
            <LikeButton postId={post.id} initialState={{
                likes:post?._count?.likes,
                isLikedByUser:post?.likes.some((l)=>l.userId === session?.user?.id)
            }}/>
           
        </div>
        <div className='flex items-center'>
            <FaRegComment color='lightgray'  className=''/>
            <div className='text-xs text-gray-400 font-semibold z-10'>{"120"}</div>
        </div>
        <div className='flex items-center'>
           <BookmarkButton initialState={{isBookMarkedByUser:post.bookmarks.some((i)=>i.userId===session?.user?.id)}} postId={post.id}/>
               </div>
        <div className='flex items-center'>
            <Share2 size={20} color='lightgray' />
        </div>
    </div>
            {/* <VideoCard video={video} onDownload={handleDownload}/> */}
    </article>
  )
}
export default Post

interface MediaPreviewsProps {
    attachments:Media[],
}

function MediaPreviews({attachments}:MediaPreviewsProps) {
   return(
    <div className={cn("flex flex-col gap-3" ,attachments.length>1 && "sm:grid sm:grid-cols-2")}>
    {
        attachments.map((m)=>(
            <MediaPreview media={m} key={m.id}/>
        ))
    }
</div>
   )
}

interface MediaPreviewProps{
    media:Media
}

function MediaPreview({media}:MediaPreviewProps) {
    if(media.type === "IMAGE"){
    return (
       <CldImage src={media.publicId} alt='' height={100} width={100} className='w-fit'/>

    )}
    if(media.type === "VIDEO") {
        return (
            <div>
               <VideoCard video={{publicId:media.publicId}} onDownload={()=>console.log("")}/>
            </div>
        )
    }

    else {
        return <><span className='text-destructive'> unsupported media type</span></>
    }
}