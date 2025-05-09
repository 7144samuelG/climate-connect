import { useQuery } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
interface GetchannelsProps{
    id:Id<"communities">
}
export const getChannels=({id}:GetchannelsProps)=>{
    const data=useQuery(api.channels.get,{communityid:id});

    const isloading=data===undefined;

    return{isloading,data}
}