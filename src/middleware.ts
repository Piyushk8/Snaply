import NextAuth from "next-auth"

import authConfig from "./auth.config"

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,publicRoutes
} from "@/routes"
import { NextRequest } from "next/server"
import { Session } from "next-auth"

  const { auth } = NextAuth(authConfig)

  export default  auth(async(req)=> {    
    
    const {nextUrl } = req;
    const isLoggedIn = !!req.auth
    // const session = await auth()
    // console.log(session)
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix) && (!nextUrl.pathname.startsWith("/auth/profile"))    
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    
    if(isApiAuthRoute){
        return  ;
    }
    if(isAuthRoute){
        if(isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        return ; 
    }
    if(!isLoggedIn && !isPublicRoute) return Response.redirect(new URL("/auth/signin",nextUrl))
    
    
    return ;
    }) 

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],}