"use client"

import { useToast } from '@/hooks/use-toast'
import useFollowerInfo from '@/hooks/useFollowerInfo'
import { FollowerInfo } from '@/lib/types'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'

interface FollowButtonProps{
    userId:string,
    initialState:FollowerInfo
}

const FollowButton = ({
    userId,initialState
}:FollowButtonProps) => {
    const {toast} = useToast()
    const queryClient = useQueryClient()
    const {data} = useFollowerInfo(userId,initialState)
    const queryKey:QueryKey = ["follower-info",userId];
    
    const {mutate} = useMutation({
        mutationKey:["follower-info",userId],
        mutationFn:async()=>{
            data?.isFollowedByUser ? 
              await axios.delete(`/api/users/${userId}/follows`)
            : await axios.post(`/api/users/${userId}/follows`) 
        },
        onMutate:async()=>{
          await queryClient.cancelQueries({queryKey});
          const previousState = queryClient.getQueryData<FollowerInfo>(queryKey)
          queryClient.setQueryData<FollowerInfo>(queryKey,()=>({
            followers:
            (previousState?.followers || 0 ) + 
            (previousState?.isFollowedByUser ? -1 : 1),
            isFollowedByUser:!previousState?.isFollowedByUser
          })) 
          return {previousState}
        },
        onError:(error,variables,context)=>{
          queryClient.setQueryData(queryKey,context?.previousState)
          toast({
            variant:"destructive",
            description:"something went wrong. Please try again"
          })
        },
        onSuccess:()=>{
            
        }
    })
    
    return (
    <Button variant={data?.isFollowedByUser? "secondary":"default"} 
        onClick={()=> mutate()}
    >
      {
        data?.isFollowedByUser ? "Following":"Follow"
      }
    </Button>
  )
}

export default FollowButton
