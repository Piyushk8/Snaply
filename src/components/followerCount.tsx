"use client"
import useFollowerInfo from '@/hooks/useFollowerInfo'
import { FollowerInfo } from '@/lib/types'
import React from 'react'
interface FollowerCountProps{
    userId:string,
    initialState:FollowerInfo
}

const FollowerCount = ({userId,initialState}:FollowerCountProps) => {
    const {data} = useFollowerInfo(userId,initialState)
  
    return (<span>
        Followers:{" "}
        <span className='font-semibold'>{data?.followers}</span>
    </span>)
}

export default FollowerCount
