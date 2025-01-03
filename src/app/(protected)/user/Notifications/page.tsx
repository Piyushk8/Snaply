"use client"

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

import NotificationComponent from '@/app/(protected)/user/Notifications/notificationComponent'
import InfinityScrollContainer from '@/components/infinityScrollContainer'

const NotificationPage = () => {

  const {data:session} = useSession()
  const queryCLient = useQueryClient()
  
  const {
    data
    ,error    
    ,hasNextPage,    
    isFetchingNextPage,
    status,
    fetchNextPage
    }= useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam = null }) => {
          const { data } = await axios.get('/api/notifications', {
            params: { cursor: pageParam }, // Use `params` for query parameters
          });
         
          return data;
        },
        getNextPageParam: (lastPage) => {
          
          return lastPage?.nextCursor ?? null;
        },
        initialPageParam: null,
      });

  const {mutate} = useMutation({
        mutationKey:["unread-notifications-count"],
        mutationFn:async()=>{
            const {data} = await axios.patch("/api/notifications/mark-asread")
            return data
        }
        ,onMutate: async()=>{
            await queryCLient.cancelQueries({queryKey:["unread-notifications-count"]})

            queryCLient.setQueryData(
                ["comments"],{
                    unreadCount:0
                }
            )
        },
        onError(error) {
            console.log(error)
        },
        
    })
//to mark as read on visiting to this page automatically      
    useEffect(()=>{
      console.log("refreshed ")
        mutate()
      },[mutate])  

      
    if(status === "pending") {
      return (
          <>
              <div className='text-center text-4xl w-full flex justify-center items-center gap-3'>
                  Fetching Posts <Loader2 className='animate-spin text-4xl'/>
              </div>
          </>
      )
    }
    if(status==="error") {
      return (<>
          <div className='text-destructive'>
              Error Occured try again later! 
              
              <div className='text-gray-400'>
              {error?.message}
              </div>
          </div>
      </>)
    }

    const notifications = data?.pages.flatMap((page)=>page.notifications)
    
    return (
      <div className='w-full flex flex-col items-center gap-3'>
        <div className='bg-card p-3 rounded-2xl font-bold w-full text-2xl text-center'>
          Notifications
        </div>
        <InfinityScrollContainer onBottomReached={()=>{
          hasNextPage && fetchNextPage()
           }}
           className='w-2/3 space-y-2'
           >
          {
            notifications?.map((notification,index)=>{
              return <div key={index}> 
              <NotificationComponent notification={notification}/>
              </div>
            })
          }

        </InfinityScrollContainer>
      </div>
)
}

export default NotificationPage