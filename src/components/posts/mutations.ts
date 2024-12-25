import { useToast } from "@/hooks/use-toast";
import { PostData, POstPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";


export function useDeletePostMutation() {
    const {toast} = useToast()

    const queryClient = useQueryClient();

    const router  = useRouter()
    const pathName = usePathname();

    const mutation = useMutation({
        mutationFn:deletePost,
        onSuccess:async(deletedPost)=>{
            const queryFilter : QueryFilters = {queryKey: ['post-feed'],
            }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<POstPage,string|null>>(
               queryFilter,
               (oldData)=>{
                    if(!oldData) return;

                    return {
                        pageParams:oldData.pageParams,
                        pages:oldData.pages.map((page)=>({
                            nextCursor:page.nextCursor,
                            posts:page.posts.filter((p)=>p.id !== deletedPost?.id)
                        }))
                    }

               }
            )
            toast({
                description:"Post deleted successfully."
            })
            if(pathName===`/posts/${deletedPost.id}`){
                router.push(`/users/${deletedPost.user.username}`)
            }
          
        },
        onError(error){
            console.log("delete post mutation:",error);
        toast({
            variant:'destructive',
            description:'Please try again!'
        })

        }
        
    })
    return mutation
    
     
}