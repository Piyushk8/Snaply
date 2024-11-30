import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'

const MobileMenu = () => {
    const [isOpen,setisOpen] = useState(false)
  return (
    <div className=''>
       <HamburgerMenuIcon/>
    </div>
  )
}

export default MobileMenu