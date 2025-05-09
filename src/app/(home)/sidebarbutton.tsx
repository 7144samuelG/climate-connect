"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SideBarProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  path?:string
}

export const SideBarButton = ({ icon: Icon, label, isActive,path }: SideBarProps) => {
  const router=useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group" onClick={()=>router.push(`/${path}`)}>
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20 p-3"
        )}
      >
        <Icon className="h-[33px] w-[33px] group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-white text-[13px] font-[500] group-hoverbg-accent">
        {label}
      </span>
    </div>
  );
};
