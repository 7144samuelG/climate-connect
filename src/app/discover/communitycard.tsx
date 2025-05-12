"use client";
import { useMutation } from "convex/react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CommunityCardProps {
  community: Doc<"communities">;
}
export const CommunityCard = ({ community }: CommunityCardProps) => {
  const join = useMutation(api.communities.Join);
  const router = useRouter();
  const handleCommunities = async(id: Id<"communities">) => {
    try {
      await join({ communityid: id });

      router.push(`mycommunities/communityid/${id}`);
      toast.success("welcome")
    } catch {
      toast.error("something went wrong")
    }
  };

  return (
    <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header / Banner */}
      <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl" />

      {/* Content */}
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          {community.name.substring(0, 20)}
        </h1>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {community.description}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => handleCommunities(community._id)}
        >
          View Community
        </Button>
      </div>
    </div>
  );
};
