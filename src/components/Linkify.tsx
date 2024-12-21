import Link from 'next/link'
import React, { ReactNode } from 'react'
import {LinkIt, LinkItUrl} from "react-linkify-it"
interface LinkifyProps{
    children:ReactNode
}

const Linkify = ({children}:LinkifyProps) => {
  return (
    <LinkifyUrl>{children}</LinkifyUrl>    
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
                        href={`/users/${username}`}
                        className='text-primary hover:underline'
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
                 className='text-primary hover:underline'
                 href={`/hashtag/${match.slice(1)}`}>
                 
                    {match}
                </Link>
            )

            }
        >
        
        </LinkIt>
    )
}

export default Linkify
