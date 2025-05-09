import { useQuery } from "convex/react"
import { Id } from "../convex/_generated/dataModel"
import { api } from "../convex/_generated/api"
interface GetCommunityProps{
    id:Id<"communities">
}

export const getCommunity=({id}:GetCommunityProps)=>{
    const data=useQuery(api.communities.getCommunity,{
        id:id
    });
    const isloading=data===undefined;
    return{
        isloading,data
    }
}