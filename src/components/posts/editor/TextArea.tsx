"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useTransition } from "react"
import { SubmitPost } from "./action"
import { useQueryClient,QueryFilters, InfiniteData } from "@tanstack/react-query"
import { PostData, POstPage } from "@/lib/types"

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
        await SubmitPost(data.content).then((data)=>{
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
      <Button disabled={isPending} type="submit">
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  </Form>
)}