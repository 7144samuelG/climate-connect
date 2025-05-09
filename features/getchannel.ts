import { useQuery } from "convex/react"
import { Id } from "../convex/_generated/dataModel"
import { api } from "../convex/_generated/api";

interface GetChannelProps{
    channelid:Id<"channels">;
}

export const GetChannel=({channelid}:GetChannelProps)=>{
    const data=useQuery(api.channels.getById,{
        channelid
    });

    const isloading=data===undefined;
    return{
        isloading,data
    }
}