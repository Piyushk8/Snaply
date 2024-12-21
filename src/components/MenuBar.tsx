"use client"

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Bell, Home } from 'lucide-react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface MenuBarProps{
    className?:string

}


const MenuBar =({className}:MenuBarProps) => {
    const session = useSession()
    
  return (
    <div className="space-y-5">
        <div className={className}>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='Home'
                asChild
            >
                <Link href={"/"}>
                <Home />
                <span className='hidden lg:inline'>Home</span>
                </Link>
            </Button>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='notifications'
                asChild
            >
                <Link href={"/notifications"}>
                <Bell />
                <span className='hidden lg:inline'>Notifications</span>
                </Link>
            </Button>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='bookmarks'
                asChild
            >
                <Link href={"/bookmarks"}>
                <Home />
                <span className='hidden lg:inline'>Bookmarks</span>
                </Link>
            </Button>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='Messages'
                asChild
            >
                <Link href={"/messages"}>
                <Home />
                <span className='hidden lg:inline'>Messages</span>
                </Link>
            </Button>
        </div>
        {/* <div className=''>
                <Button onClick={()=>redirect(`/user/${session.data?.user?.username}`)} className='bg-card w-fit rounded-lg text-gray-600 font-semibold' variant={"secondary"}>Profile</Button>
        </div> */}
    </div>
  )
}

export default MenuBar