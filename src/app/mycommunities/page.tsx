"use client";
import { Button } from "@/components/ui/button";
import { CreateNewCommunity } from "./create-new-community";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { getUserCommunities } from "../../../features/getusercommunities";
export default function MyCommunities() {
  const router = useRouter();
  const userCommunities= getUserCommunities();  
  console.log(userCommunities)


  useEffect(() => {
    if (userCommunities.isloading||!userCommunities.data) return;
    if(userCommunities.data.length>0){

      router.push(`/mycommunities/communityid/${userCommunities.data[0]?._id}`);
    }
    
  }, [router,userCommunities.isloading,userCommunities.data]);
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="">
        <p className="">
          Enjoy community engagement by Creating your community
        </p>
        <div className="flex items-center justify-center gap-3 py-3">
          <CreateNewCommunity>
            <Button className="cursor-pointer">create community</Button>
          </CreateNewCommunity>
          or
          <Link href="/discover" className="underline ">
            Discover communities
          </Link>
        </div>
      </div>
    </div>
  );
}
