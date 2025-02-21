"use client";

import { CommentData } from "@/lib/types";
import { formatRelative } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";
import ClientCldImage from "../CldImage";
import { useSession } from "next-auth/react";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle} from "../ui/dialog";
import { useDeleteCommentMutation, useEditComment } from "./mutations";
import { Input } from "../ui/input";

interface CommentProps {
  comment: CommentData;
}

const Comment = ({ comment }: CommentProps) => {
  const { user, content } = comment;
  const { data: session } = useSession();

  // Format the time to show "2 hours ago", "5 minutes ago", etc.
  const relativeTime = formatRelative(new Date(comment?.createdAt), new Date());

  return (
    <div className="flex items-start space-x-3 border-b border-gray-200 py-4 px-5">
      {/* User Avatar */}
      <ClientCldImage
        size={10}
        src={user?.image}
        alt={user?.name || ""}
        classname="rounded-full w-10 h-10"
      />

      <div className="flex-1">
        {/* User Name and Username */}
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Link href={`/user/${user.id}`}>
              <span className="font-semibold text-gray-900">{user.name}</span>
            </Link>
            {user.username && <span className="text-sm text-gray-500">@{user.username}</span>}
          </div>

          {comment?.userId === session?.user?.id && <CommentOptionMenu comment={comment} />}
        </div>

        {/* Comment Content */}
        <p className="mt-2 text-gray-800">{content}</p>

        {/* Comment Actions */}
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <span>{relativeTime}</span>
          <button className="flex items-center space-x-1">
            <span className="text-blue-500">Reply</span>
          </button>
          <button className="flex items-center space-x-1">
            <span className="text-red-500">Like</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;

function CommentOptionMenu({comment}:{comment:CommentData}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {mutate,isPending} = useDeleteCommentMutation(comment?.id)

  const mutation = useEditComment(comment?.postId)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="w-4 h-4" />
              Delete
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setShowEditDialog(true)}>
            <span className="flex items-center gap-3">
              <Edit2 className="w-4 h-4" />
              Edit
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <DeleteCommentDialog
          onClose={() => setShowDeleteDialog(false)}
          onDelete={()=>mutate(comment?.id)}
        />
      )}
      {
        showEditDialog && <EditCommentDialog 
          onClose={()=>setShowEditDialog(false)} 
          comment={comment}/>
      }
    </>
  );
}

interface DeleteCommentDialogProps {
  onClose: () => void;
  onDelete: () => void;
}
function DeleteCommentDialog({ onClose, onDelete }: DeleteCommentDialogProps) {
  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
        <div className="mt-4 flex space-x-2 justify-end">
          <Button
            className=""
            variant="destructive"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface onEditDialogProps {
onClose:()=>void
,comment:CommentData
}

const EditCommentDialog = ({comment,onClose}:onEditDialogProps)=>{
  const [input, setInput] = useState(comment?.content)

  const mutation = useEditComment(comment?.postId)

  const onSubmitHandler=()=>{
    console.log("edit started")
    mutation.mutate({
      commentId:comment?.id,
      content:input
    })
  }
  return (
  <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className="">
      <DialogTitle>
        Edit the Comment
      </DialogTitle>
      <form  onSubmit={onSubmitHandler} className="flex flex-col justify-between min-h-30 max-h-40 gap-5">
      <Input
        value={input}
        autoFocus
        onChange={(e)=>setInput(e.target?.value)}
      />
      <div className="flex justify-end gap-5">
        <Button type="submit" >Edit</Button>
        <Button onClick={onClose} variant={"ghost"}>cancel</Button>
      </div>
      </form>
    </DialogContent>
  </Dialog>

)

  


}



// const CommentInput = ({post}:CommentInputProps) => {
//   const [input,setInput] = useState("")

//   const mutation = useSubmitCommentMutation(post.id)

//   async function onSubmit(e:React.FormEvent) {
//       e.preventDefault();

//       if(!input) return;
//       mutation.mutate({
//           post,
//           content:input
//       },{
//           onSuccess:()=> setInput("")
//       })
//   }
  
//   return (
// <form className='flex w-full items-center gap-2' onSubmit={onSubmit}>
//   <Input
//       placeholder='write a comment.'
//       value={input}
//       onChange={(e)=>setInput(e.target.value)}
//       autoFocus
//    />
//    <Button type='submit' variant={"ghost"} size={"icon"} disabled={!input.trim() || mutation.isPending}>
//     {
//       !mutation.isPending ? (
//           <SendHorizonal/>
//       )
//       :(
//           <Loader2Icon className='animate-spin'/>
//       )
//     }   
//    </Button>

// </form>
// )
// }

// export default CommentInput
