"use client"

import { useEffect, useMemo } from "react";
import { getChannels } from "../../../../../features/getchannels";
import { getCommunity } from "../../../../../features/getcommunity";
import { useParams, useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function CommunityIdPage(){
  const params=useParams();
    const communityid=params.communityid as Id<"communities">;
    const channels=getChannels({id:communityid});
    const getcommunity=getCommunity({id:communityid});
    const channelid=useMemo(()=>channels.data?.[0]?._id,[channels.data]);
    const router=useRouter();
    useEffect(()=>{
        if(
            getcommunity.isloading ||!getcommunity.data||channels.isloading||!channels.data
        ){
            return;
        }
        if (getcommunity.data && channels.data.length>0) {
            router.push(`/mycommunities/communityid/${communityid}/channel/${channelid}`);
          } 
    },[channels.isloading,getcommunity.isloading,channels.data,getcommunity.data,channelid,router,communityid]);

    if(channels.isloading||getcommunity.isloading){
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
              <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
          );
    };
    if(!getcommunity.data){
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Community not found
        </span>
      </div>
    }
    return(
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No channel found</span>
      </div>
    )
}