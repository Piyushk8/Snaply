"use client"

import { UserAvatar } from "@/components/User-Avatar"
import { useSession } from "next-auth/react"
import userAvatar from "@/lib/businessman-character-avatar-isolated_24877-60111.jpg"
import { Textarea } from "@/components/ui/textarea"
import { TextareaForm } from "./TextArea"
export default function PostEditor(){
    const {data:session} = useSession()

    return <>
    <div className=" flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-5">
            <UserAvatar image={session?.user.image||userAvatar} className="hidden sm:inline"/>
            <TextareaForm/>
        </div>

    </div>
    
    </>
}