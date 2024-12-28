"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useCallback, useRef, useState, useTransition } from "react"
import { SubmitPost } from "./action"
import { useQueryClient,QueryFilters, InfiniteData } from "@tanstack/react-query"
import { PostData, POstPage } from "@/lib/types"
import {  UploadingFile, useMediaUpload } from "./useMediaUpload"
import {  ImageIcon, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const FormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "minimum 1 character required",
    })
    .max(160, {
      message: "Post must not be longer than 30 characters.",
    }),
})

export function TextareaForm() {
  const [isPending,startTransition] = useTransition()
  const queryClient = useQueryClient()
  
    const {
      allUploadComplete,
          uploadAttachments,
          attachmentUploadInfo,
          removeAttachment,
          reset:resetUpload
      } = useMediaUpload();
    


  const refreshFeed=async(post:PostData)=>{
    const queryFilter : QueryFilters = {queryKey: ['post-feed', 'for-you'],
    }
    await queryClient.cancelQueries(queryFilter)
    queryClient.setQueriesData<InfiniteData<POstPage,string|null>>(queryFilter,
      (oldData)=>{
        const firstPage = oldData?.pages[0];
        if(firstPage){
          return{
            pageParams:oldData.pageParams,
            pages:[
              {
                posts:[post,...firstPage.posts],
                nextCursor:firstPage.nextCursor
              },
              ...oldData.pages.slice(1)
            ]
          }
        }
      }
    )
  }
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const {formState:{errors},reset} = form

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async()=>{
        await SubmitPost(
          {
            content:data.content
            ,media:attachmentUploadInfo
            .map((a) => {
                if (a && a.publicId) {
                    return { publicId: a.publicId, type: a.file?.type || "unknown" };
                }
                return undefined; // Use `undefined`, which `filter(Boolean)` will remove
            })
            .filter(Boolean) as { publicId: string; type: string }[]
          }).then((data)=>{
          
            if(data.error) {
                reset({content:""})
                toast({
                    style:{width:"fit-content"},
                    title:data.error
                    ,variant:"destructive"
                })
            }
            if(data.success){
                form.reset({content:""})
                refreshFeed(data?.post)
                toast({
                    style:({width:"fit-content",backgroundColor:"green"}),
                    title: "Posted Successfully!",
                  })
            } 
        })
    })
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Tell us a little bit about yourself"
                className=" border-none resize-none overfllow-y-scroll  rounded-sm bg-gray-300 text-gray-700 min-h-fit  w-full"
                {...field}
              />
            </FormControl>
            <FormDescription>
              You can <span>@mention</span> other users and organizations.
            </FormDescription>
            {/* Display validation error */}
            <FormMessage>{errors.content?.message}</FormMessage>
          </FormItem>
        )}
      />
        {
          !!attachmentUploadInfo.length && (<AttachmentPreviews attachments={attachmentUploadInfo} removeAttachment={removeAttachment}/>)
        }
        {/* {
           && <span className="text-sm"> {uploadProgress || 0}%</span>
        } */}

          <div className="gap-5 flex justify-end ">    
            <AddAttachmentsButton onFileSelected={uploadAttachments} disabled={false}/>      
            <Button disabled={ !!attachmentUploadInfo.length ? isPending && !allUploadComplete : isPending} type="submit">
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>     
          </form>
  </Form>
)}


//! all utility components
//upload Button

interface AddAttachmentsButton{
  onFileSelected:(files:File[])=>void,
  disabled:boolean,
}

function AddAttachmentsButton({onFileSelected,disabled}:AddAttachmentsButton){

  const fileInputRef = useRef<HTMLInputElement>(null)

  return <>
    <Button 
      variant={"outline"}
      className="hover:shadow-xl"
      disabled={disabled}
      onClick={()=>fileInputRef?.current?.click()}
    >
        <ImageIcon size={40}/>
    </Button>
    <input type="file" accept="image/*,video/*"
      multiple
      ref={fileInputRef}
      className="hidden sr-only"
      onChange={(e)=>{
        const files = Array.from(e.target?.files||[])
        if(files.length) onFileSelected(files);
        //
        e.target.value = ""
      }}
    />
  </>
}


interface AttachmentPreviewsProps{
  attachments:UploadingFile[],
  removeAttachment:(fileName:string)=>void

}

function AttachmentPreviews({attachments,removeAttachment}:AttachmentPreviewsProps){

  return (<div className={cn("flex flex-col gap-3",attachments.length >1 && "sm:grid sm:grid-cols-2")}>
    {
      attachments?.map((a)=>{
        return <AttachmentPreview key={a.file.name} attachment={a} onRemoveClick={()=>removeAttachment(a.file.name)}/>
      })
    }

  </div>)

}

interface AttachmentPreviewProps{
  attachment:UploadingFile,
  onRemoveClick:()=>void
}

function AttachmentPreview({ attachment:{file,status,progress},
  onRemoveClick}:AttachmentPreviewProps){
     
    const src = URL.createObjectURL(file)
    
    return <div className={cn("relative flex justify-center items-center  mx-auto size-fit",(status==="uploading") &&"opacity-50")}>
      {/* //CLOUDIMAGE */}
      {
          <X fill="#111" className="absolute z-10 top-1 right-1" onClick={()=>onRemoveClick()} />
      }
      {
        file.type.startsWith("image") ? (
          <Image src={src} alt="" width={500} height={500} className="size-fit max-h-[30rem] rounded-2xl"/>
        ) : (
          <video controls className=" size-fit max-h-[30rem] rounded-2xl ">
              <source src={src} type={file.type}/>
            </video>
        )
      }
    {
      status==="uploading" && <div className="absolute  ">
        <Loader2 size={48} className="animate-spin"/> {`${progress}%`}
       </div>
      
    }
    </div>
}