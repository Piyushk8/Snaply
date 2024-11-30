const AuthLayout  = ({
    children
    }:{children:React.ReactNode})=>{
    
        return(
            <div className="h-lvh  flex justify-center items-center">
                {children}
            </div>
        )
    }

    export default AuthLayout