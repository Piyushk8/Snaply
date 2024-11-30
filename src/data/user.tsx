import { PrismaClient } from "@prisma/client"

export const getUserByEmail = async(email:string)=>{
    const prisma  = new PrismaClient()
    try {
        const user = await prisma.user.findUnique({
            where:{email}
        })
        return user
    } catch (error) {
        return null       
    }
}
export const getUserById = async(id:string)=>{
    const prisma  = new PrismaClient()
    try {
        const user = await prisma.user.findUnique({
            where:{id}
        })
        return user
    } catch (error) {
        return null       
    }
}