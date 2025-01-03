import { useToast } from '@/hooks/use-toast'
import { BookmarkInfo, LikeInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Bookmark, Heart } from 'lucide-react'
import React from 'react'
interface BookmarkButtonProps{
    postId:string,
    initialState:BookmarkInfo
}

const BookmarkButton = ({
    postId,
    initialState
}:BookmarkButtonProps) => {
    const {toast} = useToast()
    
    const queryCLient = useQueryClient()
    const queryKey = ["bookmark-info",postId]
    const {data} = useQuery({
        queryKey,
        queryFn:async()=>( await axios.get(`/api/post/${postId}/bookmarks`)).data
        ,initialData:initialState,
        staleTime:Infinity
    })
  
    const {mutate} = useMutation({
        mutationFn:()=> data.isBookMarkedByUser
        ? axios.delete(`/api/post/${postId}/bookmarks`) :
        axios.post(`/api/post/${postId}/bookmarks`)
        ,onMutate:async()=>{
            await queryCLient.cancelQueries({queryKey})

            const previousState = queryCLient.getQueryData<BookmarkInfo>(queryKey)
            queryCLient.setQueryData<BookmarkInfo>(queryKey,()=>({
                Bookmark: 
                (previousState?.isBookMarkedByUser ? -1 : 1),
                isBookMarkedByUser:!previousState?.isBookMarkedByUser
            }))
            return {previousState}
        },
        onError(error,variables,context){
            queryCLient.setQueryData(queryKey,
                context?.previousState
            )
            toast({
                variant:"default",
                description:"something went wrong!"
            })
        }
        
        
    })

    return (
    <div onClick={()=>mutate()} className='flex items-center gap-2'>
        <Bookmark className={cn("size-5 text-gray-400",data.isBookMarkedByUser && "fill-gray-500 text-gray-500")}/>
    </div>
  )
}

export default BookmarkButton
