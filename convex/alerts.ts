import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createuser = mutation({
  args: {
    city: v.string(),
    country: v.string(),
    phonenumber: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("unauthorized");
    }

    const alertid = await ctx.db.insert("alerts", {
      id: user.subject,
      city: args.city,
      country: args.country,
      phonenumber: args.phonenumber,
    });
    return alertid;
  },
});
