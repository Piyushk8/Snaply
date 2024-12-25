"use client"

import Link from 'next/link'
import { UserAvatar } from '../User-Avatar'
import { PostData } from '@/lib/types'
import { formateRelativeDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import UserTooltip from '../UserTooltip'
import { CldImage } from 'next-cloudinary'
import AvatarPlaceholder from "@/lib/businessman-character-avatar-isolated_24877-60111.jpg"
import ClientCldImage from '../CldImage'

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
        <div className="whitespace-pre-line break-words">
            {post.content}
        </div>
    </Linkify>
    </article>
  )
}

export default Post