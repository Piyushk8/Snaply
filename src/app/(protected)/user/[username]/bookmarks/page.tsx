"use client";

import Post from '@/components/posts/Post';
import { PostData } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import axios from 'axios';
import InfinityScrollContainer from '@/components/infinityScrollContainer';
import PostLoadingSkelton, { PostsLoadingSkeleton } from '@/components/posts/PostLoadingSkelton';
import { useSession } from 'next-auth/react';

const BookmarksPage =() => {
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
    queryKey: ['post-feed',"bookmarks"],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/post/bookmarks`, {
        params: { cursor: pageParam }, // Use `params` for query parameters
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? null;
    },
    initialPageParam: null,
  });
  
  const posts = data?.pages.flatMap(page => page.posts); // Flat map to combine all pages of posts
  
  if (status === "pending") {
    return (
      <div className='w-full gap-3 flex flex-col justify-center '>
        <div className='w-full text-3xl  rounded-2xl p-3  font-bold text-center bg-card '>
          Bookmarks
      </div>
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
  return (
   <div className='w-full space-y-5 flex  flex-col  items-center'>
      <div className='w-full text-3xl  rounded-2xl p-3  font-bold text-center bg-card '>
          Bookmarks
      </div>

      <InfinityScrollContainer className={"space-y-3 w-full md:w-2/3  "} onBottomReached={()=>{
        hasNextPage&&!isFetching && fetchNextPage()}}
        >
        {posts?.map((post: PostData) => (
          <Post post={post} key={post.id} />
        ))}

        {
          isFetchingNextPage && <PostLoadingSkelton/>
        }

      </InfinityScrollContainer>
   </div>
  );
};

export default BookmarksPage;
