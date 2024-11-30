
import Link from 'next/link'
import React from 'react'
import { UserAvatar } from '../User-Avatar'
import { PostData } from '@/lib/types'
import { formateRelativeDate } from '@/lib/utils'

interface PostProps{
    post:PostData
}

const Post = ({post}:PostProps) => {
  return (
    <article className='space-y-3 bg-card rounded-2xl p-5 shadow-sm'>
        <div className='flex flex-wrap gap-3 '>
            <Link href={"/"}>
                <UserAvatar image={post.user?.image}/>
            </Link>
            <div>
                <Link href={`/users/${post.user.username}`}
                    className='block font-medium hover:text-gray-700'
                >
                {post.user.name}
                </Link>
                <Link href={`posts/${post.id}`} 
                    className='block text-xs  text-muted-foreground hover:underline-offset-8 '
                >
                    {formateRelativeDate(post.createdAt)}
                </Link>
            </div>
        </div>
        <div className="whitespace-pre-line break-words">
            {post.content}
        </div>
    </article>
  )
}

export default Post