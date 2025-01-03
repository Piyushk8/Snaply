import { Prisma } from "@prisma/client"
import { boolean, string } from "zod"

export const getUserDataSelect =(loggedInUserId:string)=> {

  return {
    id:true,
    username:true,
    name:true,
    bio:true,
    createdAt:true, 
    image:true,
    followers:{
      where:{
          followerId:loggedInUserId
      },
      select:{
          followerId:true
      }
  },_count:{
      select:{
        receivedNotifications:true,
        posts:true,
          followers:true
      }
  }
  } satisfies Prisma.UserSelect
}

export type userData = Prisma.UserGetPayload<{
  select:ReturnType<typeof getUserDataSelect>
}>
// export const userDataSelect = {
//     id:true,
//     username:true,
//     name:true,
//     image:true
    
//   } satisfies Prisma.UserSelect
  
export function getPostDataInclude(loggedInUserId:string){
  return{user:{
        select:getUserDataSelect(loggedInUserId)
      }
      ,attachments:true,
      bookmarks:{
        where:{
          userId:loggedInUserId
        },
        select:{userId:true},
      },
      likes:{
        where:{userId:loggedInUserId},
        select:{userId:true}
    }
    ,_count:{
        select:{
            likes:true,
            comments:true
        }
    },
    } satisfies Prisma.PostInclude  
  }

  // export const postDataInclude = {
  //   user:{
  //     select:userDataSelect
  //   }
  // } satisfies Prisma.PostInclude
  
  export type PostData = Prisma.PostGetPayload<{
    include: ReturnType <typeof getPostDataInclude>
  }>


  export interface POstPage {
    posts:PostData[],
    nextCursor:string | null
  }

  export interface FollowerInfo{
    followers:number,
    isFollowedByUser:boolean
  }


export interface LikeInfo {
  likes:number,
  isLikedByUser:boolean
}


export interface BookmarkInfo{
  isBookMarkedByUser:boolean
}

export function getCommentDataInclude(loggedInUserId:string){
    return {
      user:{
        select:getUserDataSelect(loggedInUserId)
      }
    } satisfies Prisma.CommentsInclude
} 

export type CommentData = Prisma.CommentsGetPayload<{
  include:ReturnType<typeof getCommentDataInclude>
}>

export interface CommentPage{
  comments:CommentData[],
  previousCursor?:string | null,
  nextCursor?:string | null
}


export type notificationsData = Prisma.NotificationsGetPayload<{
  include:ReturnType<typeof getNotificationDataInclude>
}>
export interface NotificationPage{
  notifications:notificationsData[],
  nextCursor:string|null
}

export function getNotificationDataInclude(loggedInUserId:string){

  return {
    post:{
      select:{
          id:true,
      },
  },
  issuer:{
      select:{
          id:true,
          name:true,
          username:true,
          image:true,
      }
  },
  }satisfies Prisma.NotificationsInclude
}