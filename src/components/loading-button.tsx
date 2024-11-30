import React from 'react'
import { Button } from './ui/button'

const LoadingButton = ({pending}:{pending:boolean}) => {
  return (
    <Button className="w-full" type="submit" disabled={pending}> {
       pending? "Loading...":"Sign In"
    }
    </Button>
  )
}

export default LoadingButton