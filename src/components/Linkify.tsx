import Link from 'next/link'
import React, { ReactNode } from 'react'
import {LinkIt, LinkItUrl} from "react-linkify-it"
interface LinkifyProps{
    children:ReactNode
}

const Linkify = ({children}:LinkifyProps) => {
  return (
    <LinkifyUsername>
        <LinkifyHashtag>
         <LinkifyUrl>{children}</LinkifyUrl>  
        </LinkifyHashtag>
    </LinkifyUsername>      
)
}

const LinkifyUrl = ({children}:LinkifyProps)=>{
return (
    <LinkItUrl>{children}</LinkItUrl>   
    )
}

const LinkifyUsername = ({children}:LinkifyProps)=>{
    return(
        <LinkIt regex={/(@[a-zA-z0-9_-]+)/}
            component={(match,key)=>{
                const username = match.slice(1);
                return (
                    <Link key={key}
                        href={`/user/${username}`}
                        className='text-gray-600 hover:underline'
                        >
                        {match}
                    </Link>
                )
            }}
        >
        {children}
        </LinkIt>
    )
}
function LinkifyHashtag({children}:LinkifyProps){
    return(
        <LinkIt regex={/(#[a-zA-Z0-9]+)/}
            component={(match,key)=>(
                <Link key={key}
                 className='text-gray-600 hover:underline'
                 href={`/hashtag/${match.slice(1)}`}>
                 
                    {match}
                </Link>
            )

            }
        >
            {children}
        </LinkIt>
    )
}

export default Linkify
