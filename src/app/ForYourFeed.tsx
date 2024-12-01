"use client"

import Post from '@/components/posts/Post'
import { PostData } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'

const ForYourFeed = () => {
  const query  = useQuery({
    queryKey:["post-feed","for-you"],
    queryFn:async()=>{
        const res = await fetch('/api/post/for-you');
        if(!res.ok) {
            throw Error(`Request failed eith status code${res.status}`)
        }
        return res.json();
    }
  })
  if(query.status === "pending") return (<>
    <Loader2 className='mx-auto animate-spin'></Loader2>
  </>)
  if(query.status==="error") return (<>
    <p className="text-center text-destructive"> An Error Occured while loading posts</p>
  </>)
  console.log(query.data)
    return (
    <>
      {
        query.data.posts.map((post:PostData)=>{
            return <Post post={post} key={post.id}></Post>
        })
        
      }
    </>
  )
}

export default ForYourFeed
