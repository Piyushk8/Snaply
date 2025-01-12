"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Loader, SearchIcon } from 'lucide-react'

const SearchField = () => {
    const router = useRouter()
    const [searching, setSearching] = useState(false)
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form = e.currentTarget;
        const q = (form.q as HTMLInputElement).value.trim()

        if(!q) return
        setSearching(true)
        router.push(`/search?q=${encodeURIComponent(q)}`) 
    }
 
    return (
    <form onSubmit={handleSubmit} method='GET' action="/search" className=''>
        <div className=' relative '>
            <Input name='q' placeholder='Search..' className='pe-10 '></Input>
                {searching ?
                 <Loader className='animite-spin absolute top-2 right-3  text-muted-foreground '/>:
                 <SearchIcon className='absolute top-2 right-3  text-muted-foreground  size-5  '/>
                }
        </div>
    </form>
  )
}

export default SearchField