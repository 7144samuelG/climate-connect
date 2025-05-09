import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createuser = mutation({
  args: {
    loacation: v.string(),
    city: v.string(),
    country: v.string(),
    zip: v.string(),
    phonenumber: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("unauthorized");
    }

    const alertid = await ctx.db.insert("alerts", {
      id: user.subject,
      loacation: args.loacation,
      city: args.city,
      country: args.country,
      zip: args.zip,
      phonenumber: args.phonenumber,
    });
    return alertid;
  },
});
