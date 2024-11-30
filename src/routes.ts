
//all routes accessible without auth 

export const  publicRoutes = [
    "/settings",
    "/"
]

// Routes used for authentication 
// these will redirect loggedin users to Settings
export const  authRoutes = [
    "/auth/signin"
    ,"/auth/register"
    //,"/auth/profile",
    
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"
