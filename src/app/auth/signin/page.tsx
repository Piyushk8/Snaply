
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

import LoginForm from '@/components/auth/LoginForm'
const SignInPage = () => {
  
  return (
    <main className="flex h-screen items-center justify-center p-5">
        <LoginForm />
    </main>
  )
}

export default SignInPage