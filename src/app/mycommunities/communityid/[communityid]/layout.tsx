'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SideBar } from "../../../(home)/sidebar";
import { MyCommunitiesSideBar } from "./mycommunitiesSidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Thread } from "./channel/[channelid]/thread";

export default function CommunitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const{parentMessageId,close}=usePanel();

  const showpanel=!!parentMessageId;
  return (
    <div className="h-full flex">
      <SideBar />

      <ResizablePanelGroup direction="horizontal" autoSaveId="communities">
        <ResizablePanel  defaultSize={20}
            minSize={11}
            className="bg-[#e950e9]">
          <MyCommunitiesSideBar/>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={80} minSize={20}>
          {children}
        </ResizablePanel>
        {showpanel && (
            <>
              <ResizableHandle withHandle/>
              <ResizablePanel minSize={20} defaultSize={29}>
              {parentMessageId ? (
                 <Thread
                 messageId={parentMessageId as Id<"messages">}
                 onClose={close}
               />
              ):(
                <div className="flex h-ful items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
              )}
              </ResizablePanel>
            </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
