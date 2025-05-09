import { useMutation } from "convex/react"
import { api } from "../convex/_generated/api"


export const removeMessage=()=>{
    const data=useMutation(api.messages.deletemessage);

    const isloading=data===undefined;
    return{
        data,isloading
    }
}