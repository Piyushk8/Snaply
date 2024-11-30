
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

//import {useSession} from "next-auth/react"
//import { handleSignOut } from '@/app/actions/authActions'

import { LoginButton } from './auth/login-button'
import { auth, signOut } from '@/auth'
import UserButton from './userButton'
import { redirect } from 'next/navigation'
import MobileMenu from './MobileMenu'
import SearchField from './searchField'

export default async function  Navbar() {
  
  const session = await auth()
 
  return (
    <header className='sticky top-0 z-10 bg-card shadow-sm'>
      <div className='mx-auto  flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3'>
        <Link href={"/"} className='text-2xl font-bold text-primary'>Bubble</Link>
        <SearchField/>
        <UserButton className='sm:ms-auto '/>
      </div>
    </header>
  )
}

