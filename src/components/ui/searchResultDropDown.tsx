"use client";
import { userData } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import InfinityScrollContainer from '@/components/infinityScrollContainer';
import { FaSmileBeam } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import ClientCldImage from '../CldImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchResultsDropDown =({query}:{query:string}) => {
    const {data:session} = useSession()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status   
  } = useInfiniteQuery({
    queryKey: ['users',"search",query],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/search/users`, {
        params: { 
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
  
  const users = data?.pages?.flatMap(page => page?.users); // Flat map to combine all pages of posts

  if( !(!!users?.length) && status==="success") return (<div  className="absolute z-50 space-y-3 w-full font-bold text-card-foreground text-center bg-card p-2 rounded-2xl shadow-lg">
             no user with matching query 
             </div>)

  if (status === "pending") {
    return (
      <div 
      className= "absolute z-50 space-y-3 flex w-full font-bold text-card-foreground justify-center  bg-card p-2 rounded-2xl shadow-lg">
        <Loader2 className='animate-spin'/>
      </div>)
  }

  if (status === "error") {
    return (
      <p 
      className="absolute z-50 space-y-3 w-full font-bold text-card-foreground text-center  bg-card p-2 rounded-2xl shadow-lg">
      An error occurred while loading..
        </p>
      );
    }
  return (

    <InfinityScrollContainer
      className="absolute z-50 space-y-3 w-full p-2 bg-card flex flex-col scrollbar-thin overflow-y-auto max-h-screen border border-border rounded-2xl shadow-lg"
      onBottomReached={() => {
        hasNextPage && !isFetching && fetchNextPage();
      }}
  >
    {users?.map((user, index) => (
      <UserComponent user={user} key={index} />
    ))}
   
    {isFetchingNextPage && <Loader2 className="text-center animate-spin" />}
  </InfinityScrollContainer>
  
  );
};





const UserComponent = ({ user }: { user: userData }) => {
  const router = useRouter()
  return (
    <div
    onClick={()=>router.push(`/user/${user?.username}`)}
    className="flex items-center p-3 bg-card rounded-md w-full h-fit transition-shadow shadow-sm hover:shadow-md"
>
  <Link href={`/user/${user?.username}`} className="flex gap-3  items-center w-full h-full">
    {/* User Image */}
    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-card">
      <ClientCldImage
        src={user?.image}
        alt={`${user?.name}'s profile`}
        />
    </div>

    {/* User Details */}
    <div className="flex flex-col gap-1 text-sm w-full">
      <div className="font-medium text-card-foreground truncate">{user?.name}</div>
      <div className="text-xs text-slate-500 truncate">@{user?.username}</div>
    </div>
  </Link>
</div>
  );
};

export default SearchResultsDropDown;