import Image from "next/image";

import { AvatarIcon } from "@radix-ui/react-icons";
import Avatar from "@/lib/businessman-character-avatar-isolated_24877-60111.jpg"
interface UserAvatarProps{
    image:string| null |undefined
    size?:number
    className?:string
}
import { cn } from "@/lib/utils";
export const  UserAvatar = ({
image,
size,
className

}:UserAvatarProps)=>{
    return <Image src={Avatar}
    width={size??48}
    height={size ?? 48}
    alt="user avatar"
    className={cn("aspect-square h-fit flex-none rounded-full bg-secondary object-cover",className)}
    ></Image>
}