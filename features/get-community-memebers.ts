import { useQuery } from "convex/react";
import { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";

interface GetAllCommunityMembersProps{
    communityid:Id<"communities">;
}

export const GetAllMembers=({communityid}:GetAllCommunityMembersProps)=>{

    const data=useQuery(api.members.listCommunityMembers,{communityId:communityid});

    const isloading=data===undefined;

    return{
        data,isloading
    }
}