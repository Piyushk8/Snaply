import { auth } from '@/auth'
import CommentInput from '@/components/comments/CommentInput'
import Comments from '@/components/comments/comments'
import Post from '@/components/posts/Post'
import TrendsSidebar from '@/components/TrendsSidebar'
import prisma from '@/lib/prisma'
import { getPostDataInclude, PostData, userData } from '@/lib/types'
import { notFound, useParams } from 'next/navigation'
import React, { cache } from 'react'

const getPost = cache(async (postId:string,userId:string) => {
    const post = await prisma.post.findUnique({
      where:{
        id:postId
      },
      include:getPostDataInclude(userId)
    })

    return post
  })


const PostPage = async({params}:{params:{postId:string}}) => {
  const session = await auth()
    const param = await params
    const postId = param?.postId as string
    if(!postId) return notFound()
  const post = await getPost(postId,session?.user?.id)
  
  if(!post) return notFound()
    
    return (
     <div className=' flex flex-1 gap-4'>
       <div className='lg:w-3/5 w-full  px-1 mb-2 bg-card rounded-2xl'>
        <Post post={post}/>
        <hr className="my-2"/>
         <div className='px-5 mb-2'>
            <CommentInput post={post}/>
         </div>
         <hr className="py-2"/>
        <div>
            <Comments post={post}/>
        </div>
      </div>
      <div className='hidden lg:block'>
        <TrendsSidebar/>
      </div>
     </div>
  )
}

export default PostPage

