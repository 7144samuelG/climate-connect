"use client";
import { Doc } from "../../../convex/_generated/dataModel";

interface CommunityCardProps {
  community: Doc<"communities">;
}
export const CommunityCard = ({ community }: CommunityCardProps) => {
  
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <div className="h-24 bg-gradient-community"></div>
      <div className="flex flex-col justify-center items-center">

        <h1 className="font-bold">{community.name.substring(0, 5).toUpperCase()}</h1>
      <h3 className="text-sm font-medium">{community.description}</h3>


      </div>
    </div>
  );
};
