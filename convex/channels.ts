import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get=query({
    args:{
        communityid:v.id("communities")
    },
    handler:async(ctx,args)=>{

        const userid=await ctx.auth.getUserIdentity();

        if(!userid){
            throw new ConvexError("unaauthorized");
        };

        //get member
        const member=await ctx.db.query("communityMembers")
        .withIndex("by_community_user",(q)=>q.eq("communityId",args.communityid).eq("userId",userid.subject))
        .unique();
        if(!member){
            return []
        };

        const channels=await  ctx.db.query("channels")
        .withIndex("by_community",(q)=>q.eq("communityId",args.communityid))
        .collect();

        return channels;
    }

  
});
  //create community
  export const create=mutation({
    args:{
         communityId: v.id("communities"),
        title: v.string(),
        isGeneral: v.boolean(),
    },
    handler:async(ctx,args)=>{
        const userid=await ctx.auth.getUserIdentity();

        if(!userid){
            throw new ConvexError("unauthorized");
        };

        //get member
        const member=await ctx.db.query("communityMembers")
        .withIndex("by_community_user",(q)=>q.eq("communityId",args.communityId).eq("userId",userid.subject))
        .unique();

        if(!member||member.role!=="admin"){
           throw new ConvexError("unauthorized")
        };

        const parsedName = args.title.replace(/\s+/g, "-").toLowerCase();

        const channelid=await ctx.db.insert("channels",{
            communityId: args.communityId,
            title: args.title,
            isGeneral: args.isGeneral, // Flag for general channel
            createdBy:userid.subject,
        });
        return channelid;
    }
  });

  export const getById=query({
    args:{
        channelid:v.id("channels")
    },
    handler:async(ctx,args)=>{
        const userid=await ctx.auth.getUserIdentity();

        if(!userid){
            throw new ConvexError("unauthorized");
        };

        //get the channel
        const channel=await ctx.db.get(args.channelid);
          
        if(!channel){
            return null;
        }

        const member=await ctx.db.query("communityMembers")
        .withIndex("by_community_user",(q)=>q.eq("communityId",channel.communityId).eq("userId",userid.subject))
        .unique();

        if(!member){
            return null;
        };

        return channel;
    }
  })

  //remove channel

  export const removeChannle=mutation({
    args:{
        channelid:v.id("channels")
    },
    handler:async(ctx,args)=>{
         //get the channel
         const channel=await ctx.db.get(args.channelid);
         const userid=await ctx.auth.getUserIdentity();

         if(!userid){
             throw new ConvexError("unauthorized");
         };
 
         if(!channel){
             return null;
         }
         const member=await ctx.db.query("communityMembers")
         .withIndex("by_community_user",(q)=>q.eq("communityId",channel.communityId).eq("userId",userid.subject))
         .unique();
 
         if(!member){
             return null;
         };
         if(!member||member.role!=="admin"){
            throw new ConvexError("unauthorized")
         };


         await ctx.db.delete(args.channelid);

         return args.channelid;
    }
  })