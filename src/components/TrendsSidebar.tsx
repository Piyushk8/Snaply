import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { userDataSelect } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'
import { UserAvatar } from './User-Avatar'
import Link from 'next/link'
import { Button } from './ui/button'
import { unstable_cache } from 'next/cache'

const TrendsSidebar = () => {
  return (
    <div className='sticky top-[5.25rem] hidden h-fit flex-none md:block lg:w-80 w-72'>
        <Suspense fallback={<Loader2 className='mx-auto animate-spin'></Loader2>}>
            <WhoToFollow/>
            {/* <TrendingTopics/> */}
        </Suspense>

    </div>
  )
}


const WhoToFollow=async() => {
    const session = await auth()
    if(!session?.user) return null;
    
    const usersToFollow = await prisma.user.findMany({
        where:{
            NOT:{
                id:session.user?.id
            }
        },
        select:userDataSelect,
        take:5
        
    })
    return (
        <div className='space-y-5 rounded-2xl bg-card p-5 shadow-sm'>
        <div className="text-xl font-bold"> Who To Follow</div>
        {
            usersToFollow.map((user)=>(
                <div 
                    key={user.id}
                    className="flex items-center justify-between gap-3">
                        <Link href={`/users/${user.username}`} className='flex items-center gap-3'>
                        <UserAvatar image={user.image} className='flex-none'/>
                        <div>
                            <p className='line-clamp-1 break-all font-semibold hover:text-gray-500'>{user.name}</p>
                            <p className='line-clamp-1 break-all text-muted-foreground '>@{user.username}</p>
                        </div>
                        </Link>
                        <Button>Follow</Button>
                </div>
            ))
        }
    </div>)
    
}

export default TrendsSidebar 

const getTrendingTopics =  unstable_cache(async()=>{
    const result = await prisma.$queryRaw<{hashtag:string;count:bigint}[]>`
          SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
    `
    
})


export const TrendingTopics = async()=>{

}