import { SideBar } from "../(home)/sidebar";
import DisasterAlertForm from "./alert";

export default function DisasterAlerts(){
    return(
        <div className=" flex min-h-screen h-full w-full">
                    <SideBar/>
                    <DisasterAlertForm/>
        </div>
    )
}