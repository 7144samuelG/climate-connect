import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { Id } from "../convex/_generated/dataModel"

interface GetCurrentCommunityProps{
    id:Id<"communities">
}

export const getCurrentCommunity=({id}:GetCurrentCommunityProps)=>{
    const data=useQuery(api.communities.getCommunity,{
        id:id
    });

    const isloading=data===undefined;

    return{
        isloading,data
    }
}