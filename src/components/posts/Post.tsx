"use client"

import Link from 'next/link'
import { UserAvatar } from '../User-Avatar'
import { PostData } from '@/lib/types'
import { formateRelativeDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostMoreButton from './PostMoreButton'

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
                <Link href={"/"} className=''>
                    <UserAvatar image={post.user?.image}/>
                </Link>
                <div>
                    <Link href={`/user/${post.user?.username}`}
                        className='block font-medium hover:text-gray-700'
                    >
                    {post.user?.name}
                    </Link>
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
        <div className="whitespace-pre-line break-words">
            {post.content}
        </div>
    </article>
  )
}

export default Post