"use client"
import {  useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Bell } from 'lucide-react'
import React from 'react'

const NotificationsButton = ({initialState}:{initialState:number}) => {
    
    const {data} = useQuery({
        queryKey:["unread-notifications-count"],
        staleTime:1000,
        initialData:initialState,
        queryFn:async()=>{
            const {data} = await axios.get("/api/notifications/unread-count")
            return data
        }
    })


    return (
       
<div className="relative">
    <Bell className="relative" />
    {!!data?.unreadCount && (
        <span className="absolute  -right-3 -top-3 rounded-full bg-primary w-fit p-1 h-5 flex items-center justify-center text-xs font-medium text-primary-foreground">
            {data?.unreadCount > 99 ? "99+":data?.unreadCount}
        </span>
    )}
</div>

          
     )
}

export default NotificationsButton
