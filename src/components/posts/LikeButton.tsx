import { useToast } from '@/hooks/use-toast'
import { LikeInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Heart } from 'lucide-react'
import React from 'react'
interface LikeButtonProps{
    postId:string,
    initialState:LikeInfo
}

const LikeButton = ({
    postId,
    initialState
}:LikeButtonProps) => {
    const {toast} = useToast()
    
    const queryCLient = useQueryClient()
    const queryKey = ["like-info",postId]
    const {data} = useQuery({
        queryKey,
        queryFn:async()=>( await axios.get(`/api/post/${postId}/likes`)).data
        ,initialData:initialState,
        staleTime:Infinity
    })
  
    const {mutate} = useMutation({
        mutationFn:()=> data.isLikedByUser
        ? axios.delete(`/api/post/${postId}/likes`) :
        axios.post(`/api/post/${postId}/likes`)
        ,onMutate:async()=>{
            await queryCLient.cancelQueries({queryKey})

            const previosState = queryCLient.getQueryData<LikeInfo>(queryKey)
            queryCLient.setQueryData<LikeInfo>(queryKey,()=>({
                likes:
                (previosState?.likes || 0) + 
                (previosState?.isLikedByUser ? -1 : 1),
                isLikedByUser:!previosState?.isLikedByUser
            }))
            return {previosState}
        },
        onError(error,variables,context){
            queryCLient.setQueryData(queryKey,
                context?.previosState
            )
            toast({
                variant:"default",
                description:"something went wrong!"
            })
        }
        
        
    })

    return (
    <div onClick={()=>mutate()} className='flex items-center gap-2'>
        <Heart className={cn("size-5",data.isLikedByUser && "fill-red-500 text-red-500")}/>
       {data.likes===0 ? "" : data.likes}
    </div>
  )
}

export default LikeButton
