"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SideBarHistory = () => {
  const notes = useQuery(api.note.AllNotes, {});
  const router=useRouter();
  return (
    <div className="pt-[10px] bg-gray-100 px-3 w-[350px] overflow-x-hidden overflow-y-auto h-full min-h-screen">
      <h1 className="font-bold text-[20px] py-3 px-1">Chat History</h1>
      <div>
        {notes &&
          notes.map((note, index) => (
            <Link
              key={index}
              href={`/chatbot/${note._id}`}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg w-full block"
            >
              {note.title}
            </Link>
          ))}
      </div>
      <Button type="button" variant="outline" onClick={()=>router.push("/chatbot")}className="w-full p-2 cursor-pointer">
        New Chat
      </Button>
    </div>
  );
};
