import { PostData } from '@/lib/types'
import React from 'react'
import { useDeletePostMutation } from './mutations'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
interface DeletePostDialogProps{
    post:PostData,
    open:boolean | undefined,
    onClose:()=>void
}

const DeletePostDialog = ({
    open,
    onClose,
    post
}:DeletePostDialogProps) => {

    const mutation = useDeletePostMutation()
    const handleOpenChange = ()=>{
        if(!open || !mutation.isPending) {
            onClose()
        }

    }
  
    return (
    <Dialog open={open} onOpenChange={handleOpenChange}> 
        <DialogContent>
           <DialogHeader>
                 <DialogTitle>
                    Delete Post
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete the Post?
                    This action cannot be undone.
                </DialogDescription>
           </DialogHeader>
           <DialogFooter>
                <Button variant={"destructive"} onClick={()=>mutation.mutate(post.id,{onSuccess:onClose})} 
                    disabled={mutation.isPending}> 
                    Delete
                </Button>
                
                <Button variant={"outline"} disabled={mutation.isPending} onClick={onClose} >Cancel</Button>
           </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeletePostDialog