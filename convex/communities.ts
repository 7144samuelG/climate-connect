import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
export const createCommunity = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    isPublic: v.boolean(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const getuser = await ctx.auth.getUserIdentity();
    if (!getuser) {
      throw new ConvexError("unauthorized");
    }
  
    console.log(getuser)
    const communityId = await ctx.db.insert("communities", {
      name: args.name,
      description: args.description,
      creatorid: getuser.subject,
      isPublic: args.isPublic,
      membersCount: 1,
      imageUrl: args.imageUrl,
    });

    //create general channel
    const channelid=await ctx.db.insert("channels", {
      communityId,
      title: "general",
      isGeneral: true,
      createdBy: getuser.subject,
    });

    //add owner as firtmember and admin
    await ctx.db.insert("communityMembers", {
      communityId,
      userId: getuser.subject,
      name:getuser.name ?? "Anonymous",
      email:getuser.email?? "",
      avatar:getuser.pictureUrl?? "",
      role: "admin",
    });
    return {communityId,channelid};
  },
});

//query all available channels
export const getallchannels = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("unauthorized");
    }

    if (search) {
      return await ctx.db
        .query("communities")
        .withSearchIndex("search_name", (q) =>
          q.search("name", search).eq("name", search)
        )
        .paginate(paginationOpts);
    };
    return await ctx.db.query("communities").paginate(paginationOpts);
  },
});

//get users community created or part of
export const getUserCommunities = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
   
    if (!user) {
      throw new ConvexError("unauthorized");
    }
    console.log(user)
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
      .collect();

    const communitiesIds = members.map((member) => member.communityId);

    const usercommunities: Doc<"communities">[] = [];

    for (const communityId of communitiesIds) {
      const community = await ctx.db.get(communityId);

      if (community) {
        usercommunities.push(community);
      }
    }
    return Promise.all(
      usercommunities.map(async (comm) => ({
        ...comm,
        imageUrl: comm.imageUrl
          ? await ctx.storage.getUrl(comm.imageUrl)
          : undefined,
      }))
    );
  },
});
//get community by id
export const getCommunity = query({
  args: {
    id: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const userid = await ctx.auth.getUserIdentity();
    if (!userid) {
      throw new ConvexError("unauthorized");
    };
    console.log(userid)
    const member = await ctx.db
    .query("communityMembers")
    .withIndex("by_community_user", (q) =>
      q.eq("communityId", args.id).eq("userId",userid.subject)
    )
    .unique();

  if (!member) {
    throw new ConvexError("unauthorized");
  };
  const data=await ctx.db.get(args.id);
  if(!data){
    return null
  }
  return{
    ...data,
    imageUrl:data?.imageUrl?await ctx.storage.getUrl(data.imageUrl):undefined
  }
  },
});
//delete community
export const removeCommunity = mutation({
  args: {
    id: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const getuser = await ctx.auth.getUserIdentity();
    if (!getuser) {
      throw new ConvexError("unauthorized");
    }
    const community = await ctx.db.get(args.id);
    if (!community) {
      return null;
    };
    const member = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communityId", args.id).eq("userId", getuser.subject)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("unauthorized");
    };
    await ctx.db.delete(community._id);
    const [members, channels] = await Promise.all([
      ctx.db
        .query("communityMembers")
        .withIndex("by_community", (q) => q.eq("communityId", args.id))
        .collect(),

      ctx.db
        .query("channels")
        .withIndex("by_community", (q) => q.eq("communityId", args.id))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    };
    return args.id;
  },
});

export const Join=mutation({
  args:{
    communityid:v.id("communities")
  },
  handler:async(ctx,{communityid})=>{
    const userid=await ctx.auth.getUserIdentity();
    if(!userid){
      throw new ConvexError("unauthorized")
    }
    const member=await ctx.db.query("communityMembers")
            .withIndex("by_community_user",(q)=>q.eq("communityId",communityid).eq("userId",userid.subject))
            .unique();
            if(member){
                return 
            };

            await ctx.db.insert("communityMembers", {
              communityId:communityid,
              userId: userid.subject,
              name:userid.name ?? "Anonymous",
              email:userid.email?? "",
              avatar:userid.pictureUrl?? "",
              role: "member",
            });
            return communityid;      
    
  }
})