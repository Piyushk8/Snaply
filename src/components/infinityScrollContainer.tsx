import React from 'react'
import {useInView} from "react-intersection-observer"
interface infinityScrollContainerProps extends React.PropsWithChildren{
    onBottomReached:()=>void,
    className?:string
}

const InfinityScrollContainer = ({
    children,
    onBottomReached,
    className
}:infinityScrollContainerProps) => {
 
    const {ref} = useInView({
        rootMargin:"200px",
        onChange(inView){
            if(inView){
                onBottomReached();
            }
        }
    })

    return (
    <div className={className}>
        {children}
        <div ref={ref}/>
    </div>
  )
}

export default InfinityScrollContainer
