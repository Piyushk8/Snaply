import React from 'react'
import { Skeleton } from '../ui/skeleton'

export const PostsLoadingSkeleton=()=>{
    return (
        <div className=' space-y-5'>
        <PostLoadingSkelton/>
        <PostLoadingSkelton/>

        </div>
    )
}

const PostLoadingSkelton = () => {
  return (
    <div className='w-full animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm'>
      <div className="flex flex-wrap gap-3 ">
        <Skeleton className='size-12 rounded-full'></Skeleton>
        <div className="space-y-1.5">
            <Skeleton className='h-4 w-24 rounded '></Skeleton>
            <Skeleton className='h-4 w-20 rounded '></Skeleton>
        </div>
      </div>
    <Skeleton className='h-16 rounded'/>
    </div>

  )
}

export default PostLoadingSkelton
