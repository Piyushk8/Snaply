"use client";

import Post from '@/components/posts/Post';
import { PostData } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import InfinityScrollContainer from '@/components/infinityScrollContainer';
import PostLoadingSkelton, { PostsLoadingSkeleton } from '@/components/posts/PostLoadingSkelton';
import DeletePostDialog from '@/components/posts/DeletePostDialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { FaSmileBeam } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

interface SearchResultsPagePrps{
  query?:string,
  queryType?:string}

const SearchResultsPage =({query,queryType}:SearchResultsPagePrps) => {
    const {data:session} = useSession()
    const user = session?.user
  
//  const isFetchingNextPage= true
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status   
  } = useInfiniteQuery({
    queryKey: ['post-feed',"search",query],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/search`, {
        params: { 
            type:queryType,
            q:query,
            ...pageParam ? {cursor: pageParam} : {} }, // Use `params` for query parameters
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? null;
    },
    gcTime:0,
    initialPageParam: null,
  });
  
  const posts = data?.pages?.flatMap(page => page?.posts); // Flat map to combine all pages of posts

  if( !(!!posts?.length) && status==="success") return (<div className='gap-3 text-center font-bold text-xl  flex justify-center items-center'>
             No Posts Found <FaSmileBeam className=''/>
             </div>)

  if (status === "pending") {
    return (
      <div className='w-full gap-3 flex flex-col justify-center '>
        <PostsLoadingSkeleton/>
      </div>)
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
          An error occurred while loading posts
        </p>
      );
    }
    console.log(posts)
  return (
   <div className='w-full space-y-5 flex  flex-col  items-center'>

      <InfinityScrollContainer className={"space-y-3 w-full md:w-2/3  "} onBottomReached={()=>{
        hasNextPage&&!isFetching && fetchNextPage()}}
        >
        {posts?.map((post: PostData,index) => (
          <Post post={post} key={index} />
        ))}
        {posts?.map((post: PostData,index) => (
          <Post post={post} key={index} />
        ))}
        {posts?.map((post: PostData,index) => (
          <Post post={post} key={index} />
        ))}

        {
          isFetchingNextPage && <PostLoadingSkelton/>
        }

      </InfinityScrollContainer>
   </div>
  );
};

export default SearchResultsPage;
