import { SideBar } from "../(home)/sidebar";
import { Alertform } from "./alertform";

export default function DisasterAlerts() {
  return (
    <div className=" flex max-h-screen  w-full">
      <SideBar />
      <div className="flex-1 ">
        <Alertform/>
      </div>
    </div>
  );
}
