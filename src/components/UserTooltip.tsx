"use client"

import { FollowerInfo, userData } from "@/lib/types";
import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { UserAvatar } from "./User-Avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

interface UserTooltipProps extends PropsWithChildren {
    user:userData
}

export default function UserTooltip({
  children,  user
}:UserTooltipProps) {
    const session = useSession()
    const followerState:FollowerInfo={
        followers:user._count.followers,
        isFollowedByUser:!!user.followers.some(({followerId})=>followerId===user.id)
    }
    return (<>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <div className="bg-gray-500 flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
                        <div className="flex items-center justify-between gap-2">
                            <Link href={`/user/${user.username}`}>
                                <UserAvatar size={70} image={user.image}></UserAvatar>
                            </Link>
                {
                   session?.data?.user?.id !==user.id && <FollowButton initialState={followerState} userId={user.id} ></FollowButton>
                }
                        </div>
                        <div>
                            <Link href={`/user/${user.username}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user.name}
                                </div>
                                <div className="text-muted-foreground">@{user.name}</div>
                            </Link>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </>)
}