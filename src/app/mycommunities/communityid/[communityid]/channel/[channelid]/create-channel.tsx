"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

interface CreatenewChannelProps {
  communityid: Id<"communities">;
  children: React.ReactNode;
}
export const CreateNewChannel = ({
  children,
  communityid,
}: CreatenewChannelProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const createChannel = useMutation(api.channels.create);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createChannel({
        title: name,
        communityId: communityid,
        isGeneral: true,
      });
      if (response) {
        toast.success("channel created");
        router.push(
          `/mycommunities/communityid/${communityid}/channel/${response}`
        );
      }
    } catch {
      toast.error("failed to create a channel");
    } finally {
      setLoading(false);
      setName("");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create new Channel</DialogTitle>
          <DialogDescription>Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="">
          <form onSubmit={handleFormSubmit}>
            <div className="">
              <Label
                className="pb-2 block text-sm/6 font-medium text-gray-900"
                htmlFor="name"
              >
                Channel name
              </Label>
              <Input
                id="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="climate ..."
                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>

            <DialogFooter className="flex items-center justify-between mt-2">
              <DialogClose asChild onClick={(e) => e.stopPropagation()}>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
