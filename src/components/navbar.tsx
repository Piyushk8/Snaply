
import Link from 'next/link'
import React from 'react'
import { auth, signOut } from '@/auth'
import UserButton from './userButton'

export default async function  Navbar() {
    const session = await auth()
  return (
    <header className='sticky top-0 z-10 backdrop-blur-lg dark:border border-border bg-card shadow-sm'>
      <div className='mx-auto  flex max-w-7xl  items-center justify-center gap-5 px-5 py-3'>
        <Link href={"/"} className='text-2xl font-bold text-primary'>Nest</Link>
        <UserButton user={session?.user} className='ms-auto '/>
      </div>
    </header>
  )
}

