"use client"

import React, { useState, useTransition } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
Form , FormControl,FormField,FormItem,FormLabel
} from "@/components/ui/form"

import { RegisterSchmema } from '@/schemas'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-Success'

import { register } from '@/actions/register'
import { useRouter } from 'next/navigation'

export  const RegisterForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchmema>>({
    resolver:zodResolver(RegisterSchmema),
    defaultValues:{
      email:"",
      name:"",
      password:""
    }
  })

  const onSubmit = (values:z.infer<typeof RegisterSchmema>)=>{
    setError("") 
    setSuccess("") 
    startTransition(()=>{
      register(values).then((data)=>{
        setError(data.error)
        setSuccess(data.success)
         if (data.success) {
          router.push("/auth/signin") // or "/" if you want
        }
      })
     })
  }
  return (
    <CardWrapper 
      headerLabel={"Create an Account"}
      backButtonHref={"/auth/signin"}
      backButtonLabel={"Already have an account?"}
      showSocial>
      <Form {...form}>
        <form action="" 
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
              >  
              <div>
                <FormField 
                  control={form.control}
                  name="name"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='your name'
                          type='name'
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="email"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='johndoe@xyz.com'
                          type='email'
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="password"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder='Password'
                          type='password'
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormSuccess message={success}/>
              <FormError message={error} />
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full">
                  
                Create an Account
              </Button>
              </form>  

      </Form>    

    </CardWrapper>
  )
}

