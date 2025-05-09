"use client";

import { useMutation } from "convex/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

interface RemovedialogProps {
  id: Id<"communities">;
  children: React.ReactNode;
}
export const RemoveDialog = ({ id, children }: RemovedialogProps) => {
  const router=useRouter();
  const remove = useMutation(api.communities.removeCommunity);
  const [isRemoving, setIsRemoving] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.This will delete your community
            permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);
              remove({ id: id })
              .catch(()=>toast.error("something went wrong"))
              .then(()=>{toast.success("community deleted")

                router.push("/mycommunities")
              })
              .finally(() => {
                setIsRemoving(false);
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};