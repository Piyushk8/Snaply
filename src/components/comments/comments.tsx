"use client"

import { PostData } from '@/lib/types'
import React from 'react'
import Comment from './comment'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '../ui/skeleton'
import InfinityScrollContainer from '../infinityScrollContainer'
import { Loader2 } from 'lucide-react'

interface CommentsProps{
    post:PostData
}


const Comments = ({post}:CommentsProps) => {
    
   //use query to retreice data 
    const {
       data,
       fetchNextPage,
       hasNextPage,
       isFetching,
       isFetchingNextPage,
       status   
     } = useInfiniteQuery({
       queryKey: ["comments",post?.id],
       queryFn: async ({ pageParam = null }) => {
        //  if(post?.id === 'cm58bh3wd0003u4l4aga71288') console.log("data",pageParam)
         const { data } = await axios.get(`/api/post/${post?.id}/comments`, {
           params: { cursor: pageParam }, // Use `params` for query parameters
         });
          if(post?.id === 'cm58bh3wd0003u4l4aga71288') console.log("data",data)
         return data;
       },
        getNextPageParam: (lastPage) => {
          if(post?.id === 'cm58bh3wd0003u4l4aga71288') console.log("last page",lastPage)
            return lastPage?.nextCursor ?? null;          
         },
        // getPreviousPageParam:(firstPage)=>{
        //   return firstPage?.previousCursor ?? null
        // },
       initialPageParam: null,
     });
     
      
    //destructure comments from data
    
      const comments = data?.pages.flatMap(page => page.comments) || []// Flat map to combine all pages of posts
      if(!comments.length && !isFetching) return (<div className='flex-col gap-3 text-center font-bold text-xl  flex justify-center items-center'>
                <div>No comments</div>  
                <div>Be the first to comment</div>  
                </div>)

    // console.log("commments",comments)
    if (status === "pending") {
      return (
        <Skeleton />
      );
    }
    
    if (status === "error") {
      return (
        <p className="text-center text-destructive">
            An error occurred while loading comments
          </p>
        );
      }
      return (
        <InfinityScrollContainer className={"space-y-1"} onBottomReached={()=>{
          hasNextPage&&!isFetching && fetchNextPage()}}>

            {
                comments?.map((c)=>(
                    <Comment comment={c} key={c?.id||crypto.randomUUID}/>
                ))
            }
          {
            isFetchingNextPage && <div className='flex justify-center items-center h-5 '><Loader2 className='animate-spin p-5'/></div>
          }
    
         </InfinityScrollContainer>
      );
    };
    

export default Comments