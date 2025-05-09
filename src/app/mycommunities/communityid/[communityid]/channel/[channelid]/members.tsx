import { useCommunityId } from "@/hooks/use-communityid"
import { GetAllMembers } from "../../../../../../../features/get-community-memebers";
import { Screenloader } from "@/components/screen-loader";

export const Members=()=>{

    const communityid=useCommunityId();

    const{isloading,data}=GetAllMembers({communityid});

    if (isloading) {
        return (
          <div className="h-full flex items-center justify-center">
            <Screenloader label="loading" />
          </div>
        );
      }
      if (!data || data.length<1) {
        return (
          <div className="h-full w-full flex items-center justify-center">
            <p className="">no members</p>
          </div>
        );
      }
    return(
        <div>
            <h1 className="">Members</h1>
            {
                data.map((users)=>(
                    <div className="" key={users._id}>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm">{users.name}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}