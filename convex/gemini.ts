import Together from "together-ai";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const together = new Together({
    apiKey: process.env.TOGETHER
})

export const chat = action({
    args:{
        text: v.string(),
        noteId: v.id('note')
    },
    handler: async(ctx,args) => {
        if(!args.text) return null

        await ctx.runMutation(internal.chat.saveChat,{
            by:'user',
            data:args.text,
            noteId:args.noteId
        })
        const allChats = await ctx.runQuery(internal.chat.getAllChatsbyNote,{noteId:args.noteId})

        let FinalText;

        if(!allChats){
            FinalText = args.text
        }else{
            FinalText = allChats + args.text
        }
       
        const response = await together.chat.completions.create({
            messages:[
                {
                    role:"system",
                    content:`You are a smart chatbot, In what ways are climate change and human development contributing to the increased frequency and intensity of natural and human-made disasters globally? Discuss the interconnectedness of climate change with disasters such as floods, wildfires, droughts, heatwaves, storms, and industrial accidents, and evaluate the role of climate education in promoting awareness, preparedness, and long-term resilience at the community, national, and global levels.`
                },
                {
                    role:"user",
                    content: FinalText
                }
            ],
            model:"meta-llama/Llama-3-70b-chat-hf"
        });
      try {
            if(response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content){
                await ctx.runMutation(internal.chat.saveChat,{
                    by:"bot",
                    data:response.choices[0].message.content || "No content recieved",
                    noteId: args.noteId
                })
            }
        } catch (error) {
            
        }
    },
  });