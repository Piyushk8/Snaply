"use client"

import { auth } from "@/auth"
import { getSession, useSession } from "next-auth/react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"

import { UserAvatar } from "./User-Avatar"
import Link from "next/link"
import { Check, Monitor, MoonIcon, Sun, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface UserButtonProps {
    className?: string
}

export default function UserButton({className}:UserButtonProps){
    const { data: session, status} = useSession();
    const {setTheme,theme}=useTheme()
    console.log(theme)
return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full",className)}>
                <UserAvatar image={session?.user?.image}
                    size={40}
                />
            </button>
        </DropdownMenuTrigger>
               <DropdownMenuContent className="px-2 py-1 ">
                <DropdownMenuLabel className="text-sm text-gray-500 ">
                    Logged in as @{session?.user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Monitor className="mr-2 size-4"></Monitor>
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>
                                <Monitor onClick={()=>setTheme("system")} className="mr-2 size-4"/>
                                System Default {theme === "system" && <Check className="ms-2"/>}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <MoonIcon onClick={()=>setTheme("dark")} className="mr-2 size-4" />
                                Dark {theme === "dark" && <Check className="ms-2"/>}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Sun onClick={()=>setTheme("light")} className="mr-2 size-4" />
                                Light {theme === "light" && <Check className="ms-2"/>}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <Link href={`/user/${session?.user?.name}`}>
                    <DropdownMenuItem className="text-gray-500">
                        <UserIcon className="mr-2 size-4"/>
                        profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>

</DropdownMenu>
}