"use client"
import { SideBar } from "../../(home)/sidebar";
import { ChatInterface } from "../chatinterface";
import { SideBarHistory } from "../sidebar";
import { useNoteId } from "@/hooks/use-note-id";

export default function AiAgent(){
    const noteid=useNoteId();
    
    return(
        <div className="h-[95vh] flex hl w-full">
            <SideBar/>
            <SideBarHistory/>
            <ChatInterface id={noteid}/>
        </div>
    )
}