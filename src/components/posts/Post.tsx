"use client"

import Link from 'next/link'
import { PostData, userData } from '@/lib/types'
import { cn, formateRelativeDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import UserTooltip from '../UserTooltip'
import { CldImage, CldOgImage } from 'next-cloudinary'
import ClientCldImage from '../CldImage'
import { Media } from '@prisma/client'
import VideoCard from '../VideoCard'
import {  ArrowRight, Share2 } from 'lucide-react'
import LikeButton from './LikeButton'
import BookmarkButton from './BookmarkButton'
import { useState } from 'react'
import { Carousel } from '../ui/carousel'
import { CommentButton } from '../comments/CommentButton'
import {Swiper, SwiperSlide, useSwiper} from "swiper/react"
import  {Keyboard, Navigation, Pagination} from "swiper/modules"
import 'swiper/css';
import 'swiper/css/pagination';



interface PostProps{
    post:PostData
}


const Post = ({post}:PostProps) => {
    
    const {data:session} = useSession()      
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
                          <Link href={`/post/${post?.id}`} 
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
                      
                      {
                        post?.attachments.length > 0 && (<div>
                            <MediaPreviews attachments={post.attachments}/>
                        </div>) 
                      }
                  </div>
              </Linkify>

              <div className='flex justify-around text-sm  text-gray-600 '>
                  <div className='flex items-center hover:bg-slate-100 rounded-full p-1'>
                      <LikeButton postId={post.id} initialState={{
                          likes:post?._count?.likes,
                          isLikedByUser:post?.likes.some((l)=>l.userId === session?.user?.id)
                      }}/>
                  </div>
                  <div  className='flex items-center gap-[1px] hover:bg-slate-100 rounded-full p-1'>
                      <CommentButton post={post} user={session?.user}/>
                  </div>
                  <div className='flex items-center hover:bg-slate-100 rounded-full p-1'>
                    <BookmarkButton  initialState={{isBookMarkedByUser:post.bookmarks.some((i)=>i.userId===session?.user?.id)}} postId={post.id}/>
                        </div>
                  <div className='flex items-center hover:bg-slate-100 rounded-full p-1'>
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
    <div className={cn("w-full flex shadow-md bg-gray-300 rounded-lg p-2 flex-col items-center gap-3" ,attachments.length>1 && "sm:grid sm:grid-cols-2")}>
{/* <div className='w-full flex flex-col items-center gap-3'>  */}
    {
        attachments.map((m)=>(
            <MediaPreview media={m} key={m.id}/>
        ))
    }

    {/* <MediaCarousel mediaItems={attachments}/> */}
</div>
   )
}

interface MediaPreviewProps{
    media:Media
}

function MediaPreview({media}:MediaPreviewProps) {
    if(media.type === "IMAGE"){
    return (
       <CldImage src={media.publicId} alt='' height={500} width={500}  className="mx-auto size-fit max-h-[30rem] rounded-2xl"/>

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
    

    export const MediaCarousel = ({ mediaItems }: { mediaItems:Media[] }) => {
        const swiper = useSwiper()
  return (
  
     <Swiper
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        pagination={{
            
          clickable: true,
        }}
        navigation={true}
        modules={[Keyboard, Pagination, Navigation]}
        className="mySwiper"
      >
    {
        mediaItems.map((media,index)=>{
            if(media?.type === "IMAGE") return (<SwiperSlide key={index}> <CldImage
                alt={''}
                width={200}
                height={200}
                src={media?.publicId}
              /></SwiperSlide>)
            else{
                return (
                <SwiperSlide key={index}>
                    <VideoCard video={{publicId:media?.publicId}} onDownload={()=>{}}/>
                </SwiperSlide>
                )
            }
            })
    }
    <button onClick={()=>swiper.slideNext()}>
        <ArrowRight/>
    </button>
    

  </Swiper>
 
  
  )
}

