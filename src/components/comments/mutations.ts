
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {  deleteComment, editComment, submitComment } from "./actions";
import { toast, useToast } from "@/hooks/use-toast";
import { CommentPage } from "@/lib/types";
import { pages } from "next/dist/build/templates/app-page";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      
      const queryKey: QueryKey = ["comments", postId];
      //console.log("new comment",newComment)
       await queryClient.cancelQueries({ queryKey });
      console.log("newcomment",newComment?.newComment)
      queryClient.setQueryData<InfiniteData<CommentPage | null>>(
        queryKey,  
        (oldData) => {
           console.log("oldData:",oldData)
           if (!oldData) return undefined;
      
          const firstPage = oldData?.pages[0];
          console.log(firstPage)
          if (!firstPage) return oldData;
      
          // Ensure `comments` array structure aligns with `CommentPage` type
          const updatedComments = [
            newComment?.newComment,
            ...(firstPage.comments?.filter((comment): comment is NonNullable<typeof comment> => 
              comment !== null && comment !== undefined
            ) ?? [])
          ].filter((comment): comment is NonNullable<typeof comment> => 
            comment !== null && comment !== undefined
          );

          console.log("updated comments:",updatedComments)
          return {
            pageParams: oldData?.pageParams || null,
            pages: [
              {
                comments:updatedComments,
                nextCursor:firstPage?.nextCursor
              },
              ...oldData?.pages?.slice(1),
            ],
          };
        },
      );
      
      
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
      queryClient.invalidateQueries({ queryKey: ['post-feed'] })
      

      toast({
        description: "Comment created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(commentId:string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async ({deletedComment}) => {
      const queryKey: QueryKey = ["comments",deletedComment?.postId];
      console.log("comment deleted",deletedComment)
      await queryClient.cancelQueries({ queryKey });
      
      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          console.log("oldData",oldData)
          if (!oldData) return;
          
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor:page.nextCursor,
              comments: page.comments.filter((c) => c.id !== commentId),
            })),
          };
        },
      );

      toast({
        description: "Comment deleted",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}


export const useEditComment = (postId:string)=>{

  const queryClient = useQueryClient()
  const mutation  = useMutation({
    mutationFn:editComment,
    onSuccess(data, variables, context) {
       queryClient.invalidateQueries({
        queryKey:  ["comments" , postId]
       })
    },
    onError:(error)=>{
      toast({
        variant:"destructive",
        description:"Edit comment failed"
      })
    }
  })

  return mutation
}