"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import useChat from "@/hooks/use-chat";
import  { useRouter } from "next/navigation";
import ChatMessages from "./chatmessages";

interface ChatInterfaceProps
{
  id?:Id<"note">
}

export const ChatInterface = ({id}:ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const[isLoading,setIsLoading]=useState(false);
  const messageIndexRef=useRef<HTMLDivElement>(null);
  const create=useMutation(api.note.createNote);

  const router=useRouter()

  const chat=useChat();
  const handeleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    const trimedinput=input.trim();
    if(!trimedinput||isLoading) return;

    if(!id){
     setIsLoading(true);
     const noteId=await create({title:input});
     await chat(input,noteId);
     setIsLoading(false);
     router.push(`/chatbot/${noteId}`)
    }else{
      setIsLoading(true);
      await chat(input,id as Id<"note">);
      setIsLoading(false);
      setInput('')
    }
  }
  return (
    <main className="w-full h-[95vh]  flex flex-col">
      {/* messages */}
    
      <div className='flex-grow overflow-auto max-w-screen-lg mx-auto w-full'>
         
                <ChatMessages waitingresponse={isLoading} id={id as Id<'note'>} />
          
        </div>
     
      <footer className=" bg-white p-4">
        <form onSubmit={handeleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative  flex items-center">
            <input
              type="text"
              value={input}
              placeholder="message ai agent..."
              onChange={(e)=>setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-gray-50 placeholder:text-gray-500"
            />
            <Button type="submit" disabled={isLoading||!input.trim()}
             className={cn("absolute right-1.5 rounded-xl h-9 w-9 flex items-center justify-center transition-all",
                input.trim()?"bg-blue-600 hover:bg-blue-700 text-white shadow-sm":"bg-gray-100 text-gray-500"
             )}
            ><ArrowRight/></Button>
          </div>
        </form>
      </footer>
    </main>
  );
};
