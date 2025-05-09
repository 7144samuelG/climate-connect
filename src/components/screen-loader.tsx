import { LoaderIcon } from "lucide-react";

interface Screenloaderprops{
    label?:string;
}
export const Screenloader=({label}:Screenloaderprops)=>{
    return(
        <div className="min-h-screen flex flex-col items-center justify-center">
            <LoaderIcon className="size-6 text-muted-foreground animate-spin"/>
            {
                label&&<p className="text-sm text-muted-foreground">{label}</p>
            }
        </div>
    )
}