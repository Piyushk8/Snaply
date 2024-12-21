import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFollowerInfo(userId:string,initialState:FollowerInfo)
 {
    const query = useQuery({
        queryKey:["follower-info",userId],

        queryFn:async()=> {
            try {
                const data =await axios.get(`/api/users/${userId}/follows`) as FollowerInfo
                return data
            } catch (error) {
                console.error(error)
            }
        },
        initialData:initialState,
        staleTime:Infinity
        
    })
    return query
}