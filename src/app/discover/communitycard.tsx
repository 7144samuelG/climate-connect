"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../convex/_generated/dataModel";
interface CommunityCardProps {
  community: Doc<"communities">;
}
export const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <div className="h-24 bg-gradient-community"></div>
      <div className="p-6 pt-0 -mt-12">
        <Avatar className="h-16 w-16 border-4 border-card">
          <AvatarImage src={community.imageUrl} alt={community.name} />
          <AvatarFallback className="bg-climate-green text-white">
            {community.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex justify-between items-start mt-4 mb-2">
          <h3 className="text-lg font-semibold">{community.name}</h3>
          {/* <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleFollow}
            className={isFollowing ? "border-climate-green text-climate-green hover:text-climate-green hover:bg-climate-green/10" : "bg-climate-green hover:bg-climate-green-dark"}
          >
            {isFollowing ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button> */}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {community.description}
        </p>
      </div>
    </div>
  );
};
