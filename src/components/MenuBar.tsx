"use server"

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Bell, Bookmark, Home } from 'lucide-react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NotificationsButton from '@/app/(protected)/user/Notifications/notificationsButton'
import prisma from '@/lib/prisma'

interface MenuBarProps{
    className?:string

}


const MenuBar = async({className}:MenuBarProps) => {
    // const {data:session} = useSession()
    const session = await auth()
        

        const unreadUserCount = await prisma.notifications.count({
            where:{
                recipientId:session?.user?.id,
                read:false
            }
        })
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
                <span className='hidden md:inline'>Home</span>
                </Link>
            </Button>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='notifications'
                asChild
            >
                <Link href={"/user/Notifications"}>
                <NotificationsButton initialState={unreadUserCount}/>
                <span className='hidden md:inline'>Notifications</span>
                </Link>
            </Button>
        <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='bookmarks'
                asChild
            >
                <Link href={`/user/${session?.user?.username}/bookmarks`}>
                <Bookmark />
                <span className='hidden md:inline'>Bookmarks</span>
                </Link>
            </Button>
            <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='Messages'
                asChild
            >
                <Link href={"/messages"}>
                <Home />
                <span className='hidden md:inline'>Messages</span>
                </Link>
            </Button>
            <Button variant={"ghost"}
                className='flex items-center justify-start gap-3'
                title='Search'
                asChild
            >
                <Link href={"/search"}>
                <Home />
                <span className='hidden md:inline'>Search</span>
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