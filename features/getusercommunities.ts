import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"

export const getUserCommunities=()=>{
    const data=useQuery(api.communities.getUserCommunities);

    const isloading=data===undefined;
    return{
        isloading,data
    }
}