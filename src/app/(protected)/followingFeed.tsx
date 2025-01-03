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

const FollowingFeed = () => {
//  const isFetchingNextPage= true
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status   
  } = useInfiniteQuery({
    queryKey: ['post-feed', 'following'],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get('/api/post/following', {
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
  if (status === "success" && !posts?.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

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
    <InfinityScrollContainer className={"space-y-3"} onBottomReached={()=>{
      hasNextPage&&!isFetching && fetchNextPage()}}>
      {posts?.map((post: PostData) => (
        <Post post={post} key={post.id} />
      ))}

      {
        isFetchingNextPage && <PostLoadingSkelton/>
      }

     </InfinityScrollContainer>
  );
};

export default FollowingFeed;
