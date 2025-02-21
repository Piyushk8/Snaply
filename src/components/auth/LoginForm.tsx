"use client"

import React, { useState, useTransition } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
Form , FormControl,FormField,FormItem,FormLabel
} from "@/components/ui/form"

import { LoginSchmema } from '@/schemas'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-Success'
import { login } from '@/actions/login'
const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchmema>>({
    resolver:zodResolver(LoginSchmema),
    defaultValues:{
      email:"",
      password:""
    }
  })

  const onSubmit = (values:z.infer<typeof LoginSchmema>)=>{
    setError("") 
    setSuccess("") 
    startTransition(()=>{
      login(values).then((data)=>{
        setError(data?.error)
        setSuccess("")
      })
     })
  }
  return (
    <CardWrapper 
      headerLabel={"Welcome Back!"}
      backButtonHref={"/auth/register"}
      backButtonLabel={"Don't have an Account?"}
      showSocial>
      <Form {...form}>
        <form action="" 
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
              >  
              <div>
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
                  
                Login
              </Button>
              </form>  

      </Form>    

    </CardWrapper>
  )
}

export default LoginForm