import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { updateUserProfileValues } from "@/lib/zodSchema";
import { POstPage } from "@/lib/types";
import { useSession } from "next-auth/react";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const {data:session,update}=useSession()
  const router = useRouter();

  const queryClient = useQueryClient();
    const uploadImage = async(avatar:File)=>{
      const FileFormData = new FormData()
      FileFormData.append("file",avatar)
      const response = await fetch("/api/image-upload",{method:"POST",body:FileFormData})
      const uploadResult = await response.json() 
      console.log(  uploadResult) 
      return uploadResult 
    }
  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: updateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && uploadImage(avatar),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.publicId;
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<POstPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.image,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast({
        description: "Profile updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}