"use client"

import { FollowerInfo, userData } from "@/lib/types";
import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { UserAvatar } from "./User-Avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";
import ClientCldImage from "./CldImage";

interface UserTooltipProps extends PropsWithChildren {
    user:userData
}

export default function UserTooltip({
  children,  user
}:UserTooltipProps) {
    const {data:session} = useSession()
    const followerState:FollowerInfo={
        followers:user._count.followers,
        isFollowedByUser:!!user.followers.some(({followerId})=>followerId===user.id)
    }
    if(!user) {
        return <>{children}</>
    }
    return (<>
        <TooltipProvider >
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent className="w-full z-40">
                    <div className="bg-card shadow-2xl flex  flex-col rounded-2xl w-[20rem]  gap-3 break-words px-3 py-3 md:min-w-52">
                        <div className="flex items-center justify-between gap-4">
                            <Link href={`/user/${user?.username}`}>
                                <ClientCldImage classname="shadow-2xl" height={70} width={70} alt="user imaage"/>
                            </Link>
                {
                   session?.user?.id !==user.id && <FollowButton initialState={followerState} userId={user?.id} ></FollowButton>
                }
                        </div>
                        <div className="px-2">
                            <Link href={`/user/${user?.username}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user?.name}
                                </div>
                                <div className="text-muted-foreground">@{user?.name}</div>
                                <div>{user?.bio}</div>
                                <div className="pt-2 pb-1 font-bold flex gap-3">
                                    <div>{user?._count?.followers} <span className="font-extralight text-muted-foreground">followers</span></div>
                                    <div>{user?._count?.following} <span className="font-extralight text-muted-foreground">following</span></div>
                                </div>
                               </Link>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </>)
}