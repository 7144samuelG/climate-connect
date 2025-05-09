import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const current = query({
    args: {
      communityId: v.id("communities"),
    },
    handler: async (ctx, args) => {
      const userId = await ctx.auth.getUserIdentity();
  
      if (userId === null) {
        return null;
      }
  
      const member = await ctx.db
        .query("communityMembers")
        .withIndex("by_community_user", (q) =>
          q.eq("communityId", args.communityId).eq("userId", userId.subject)
        )
        .unique();
  
      if (!member) {
        return null;
      }
  
      return member;
    },
  });

  export const listCommunityMembers=query({
    args:{
      communityId:v.id("communities")
    },
    handler:async(ctx,args)=>{
      const userid=await ctx.auth.getUserIdentity();
      if(!userid){
        throw new ConvexError("unauthorized")
      };
      const member=await ctx.db.query("communityMembers")
        .withIndex("by_community_user",(q)=>q.eq("communityId",args.communityId).eq("userId",userid.subject))
        .unique();
        if(!member){
            return []
        };

        return await ctx.db.query("communityMembers").collect();

    }
  })