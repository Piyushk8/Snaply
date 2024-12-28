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

const BookmarksPage = () => {
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
  if(!posts||posts.length<1 && !isFetching) return (<div className='gap-3 text-center font-bold text-xl  flex justify-center items-center'>
            No book marked posts <FaSmileBeam className=''/>
            </div>)
console.log(posts)
if (status === "pending") {
  return (
    <PostsLoadingSkeleton/>
  );
}

if (status === "error") {
  return (
    <p className="text-center text-destructive">
        An error occurred while loading posts
      </p>
    );
  }
  return (
   <div className='space-y-5 items-center flex-col '>
    <div className='text-3xl  rounded-2xl p-3  font-bold text-center bg-card '>
        Bookmarks
    </div>
     <InfinityScrollContainer className={"space-y-3"} onBottomReached={()=>{
      hasNextPage&&!isFetching && fetchNextPage()}}>
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
