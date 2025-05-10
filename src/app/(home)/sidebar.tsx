"use client";
import { CircleAlert, DiamondIcon, Home, TrainFrontTunnel, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { SideBarButton } from "./sidebarbutton";
import { UserButton } from "@clerk/clerk-react";

export const SideBar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[120px] min-h-screen  bg-[#ABABAD] flex flex-col items-center gap-y-4 pt-[9px] pb-4">
      <div className="flex-1">
      <div className="flex flex-col items-center justify-center">
      <img src="/logo.svg" alt="climate connect" className="w-[100px] h-[100px] object-cover"/>
      </div>
      <SideBarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/home")}
      />
      <SideBarButton
        icon={TrainFrontTunnel}
        path="chatbot"
        label="chatbot"
        isActive={pathname.includes("chatbot")}
      />
     
       <SideBarButton
        icon={CircleAlert}
        path="disasteralert"
        label="disaster alerts"
        isActive={pathname.includes("/disasteralert")}
      />
       <SideBarButton
        icon={Users}
        path="mycommunities"
        label="communities"
        isActive={pathname.includes("/mycommunities")}
      />
       <SideBarButton
        icon={DiamondIcon}
         path="discover"
        label="discover"
        isActive={pathname.includes("/discover")}
      /> </div>
    <div className="">
      <UserButton/>
    </div>
    </aside>
  );
};
