"use client";

import { Screenloader } from "@/components/screen-loader";
import {
  ChevronDownIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { DropdownMenuItems } from "../../dropdownmenuitems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateNewCommunity } from "../../create-new-community";
import { RemoveDialog } from "../../remove-community";
import { useParams, useRouter } from "next/navigation";
import { getUserCommunities } from "../../../../../features/getusercommunities";
import { getCurrentCommunity } from "../../../../../features/getcurrentcommunity";
import { Id } from "../../../../../convex/_generated/dataModel";
import { GetChannels } from "./channel/[channelid]/channel";
import { CreateNewChannel } from "./channel/[channelid]/create-channel";
import { useCurrentMember } from "../../../../../features/getCurrentMember";

export const MyCommunitiesSideBar = () => {
  //get user communities
  const router = useRouter();
  const params = useParams();
  const communityid = params.communityid as Id<"communities">;
  const getcommunities = getUserCommunities();
  const currentcommunity = getCurrentCommunity({ id: communityid });
  const { data, isloading } = useCurrentMember({ communityId: communityid });
  if (getcommunities.isloading || currentcommunity.isloading || isloading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Screenloader label="communities loading" />
      </div>
    );
  }
  if (!getcommunities.data || !currentcommunity.data || !data) {
    return (
      <div className="px-2 py-1 flex flex-col h-full">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-lg">Users Community</h1>
          <DropdownMenuItems />
        </div>
        <div className="flex-1 ">
          <div className="h-full flex justify-center items-center space-x-2">
            <TriangleAlertIcon className="size-4 text-rose-500" />
            <p className="text-red-500 text-sm">no community available</p>
          </div>
        </div>
      </div>
    );
  }

  const filtercommunities = getcommunities.data?.filter(
    (com) => com._id !== currentcommunity.data?._id
  );

  return (
    <div className="px-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-">
            <Avatar>
              <AvatarImage
                src={
                  currentcommunity.data?.imageUrl ||
                  (typeof currentcommunity.data?.imageUrl === "string"
                    ? currentcommunity.data?.imageUrl
                    : "")
                }
                alt={currentcommunity.data?.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <Button variant="ghost" className="flex items-center space-x-2">
                {currentcommunity.data?.name}

                <ChevronDownIcon className="size-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" side="bottom">
          <DropdownMenuLabel>Your Communities</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {filtercommunities?.map((community, _index) => (
              <div key={_index} className="w-full">
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                      onClick={(e) =>
                        router.push(
                          `/mycommunities/communityid/${community._id}`
                        )
                      }
                    >
                      {community.name}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {data.role === "admin" && (
                          <>
                            <RemoveDialog id={community._id}>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <TrashIcon />
                                Remove
                              </DropdownMenuItem>
                            </RemoveDialog>
                          </>
                        )}
                        <DropdownMenuItem>Unfollow</DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </div>
            ))}
            <CreateNewCommunity>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
              >
                Create new Community
              </DropdownMenuItem>
            </CreateNewCommunity>
            {data.role === "admin" && (
              <>
                <CreateNewChannel communityid={communityid}>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    add channel
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </CreateNewChannel>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <GetChannels />
    </div>
  );
};
