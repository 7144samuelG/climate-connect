"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustifyIcon } from "lucide-react";
import { CreateNewCommunity } from "./create-new-community";
export const DropdownMenuItems = () => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <AlignJustifyIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CreateNewCommunity>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}
            onSelect={(e)=>e.preventDefault()}>Create new Community</DropdownMenuItem>
        </CreateNewCommunity>
        <DropdownMenuItem>Discover Communities</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
