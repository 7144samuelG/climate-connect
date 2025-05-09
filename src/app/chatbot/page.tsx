"use client";

import { SideBar } from "../(home)/sidebar";
import { ChatInterface } from "./chatinterface";
import { SideBarHistory } from "./sidebar";

export default function AiAgent() {
  return (
    <div className="min-h-screen flex h-full w-full">
      <SideBar />
      <SideBarHistory />
      <ChatInterface />
    </div>
  );
}
