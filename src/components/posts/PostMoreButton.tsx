"use client"
import { PostData } from '@/lib/types'
import React, { useState } from 'react'
import { string } from 'zod'
import DeletePostDialog from './DeletePostDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal, Trash2 } from 'lucide-react'
interface PostMoreButtonProps{
    post:PostData,
    className?:string
}


const PostMoreButton = ({
    post,
    className
}:PostMoreButtonProps) => {
    const [showDeleteDialog, setshowDeleteDialog] = useState(false)
  return (
    <>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className={className}>
                <MoreHorizontal  className='size-5 text-muted-foreground'/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onClick={()=>setshowDeleteDialog(true)}>
                <span className='flex items-center gap-3 text-destructive'>
                <Trash2 className='size-4 '/>
                Delete post
                </span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <DeletePostDialog open={showDeleteDialog} post={post} onClose={()=>setshowDeleteDialog(false)} />
    </>
  )
}

export default PostMoreButton
