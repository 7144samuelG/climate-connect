import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useCommunityId } from "@/hooks/use-communityid";
import { useChannelid } from "@/hooks/use-channelid";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { toast } from "sonner";

const Editor = dynamic(() => import("./Editor"), { ssr: false });
type CreateMessageValues = {
  channelId: Id<"channels">;
  communityid: Id<"communities">;
  body: string;
  image?: Id<"_storage">;
};
export const ChatInput = ()=>{
    const [editorkey,setEditorKey]=useState(0);
    const [isPending, setIsPending] = useState(false);
    const editorRef = useRef<Quill | null>(null);
    const communityid=useCommunityId();
    const channelId=useChannelid();
    const sendmessage=useMutation(api.messages.create)
    const uploadurl = useMutation(api.upload.generateUploadUrl);
    const handleSubmit=async ({
      body,
      image,
    }: {
      body: string;
      image: File | null;
    }) => {
      try{
        setIsPending(true);
        editorRef.current?.enable(false);
  
        const values: CreateMessageValues = {
          channelId,
          communityid,
          body,
          image: undefined,
        };
        if (image!==null) {
          const url = await uploadurl()
  
          const result = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
  
          if (!result.ok) {
            throw new Error("Failed to upload image");
          }
  
          const { storageId } = await result.json();
  
          values.image = storageId;
        }
         sendmessage({
          body:values.body,
          communityId:values.communityid,
          channelId:values.channelId,
          image:values.image
         })
         setEditorKey((prev) => prev + 1);

      }catch{
        toast.error("Failed to send message");
      }finally{
        setIsPending(false);
        editorRef.current?.enable(true);
      }
    }
    return(
        <div className="px-5 w-full">
             <Editor
               key={editorkey}
               disabled={isPending}
               innerRef={editorRef}
               placeholder="tytytyty"

               onSubmit={handleSubmit}
             />
        </div>
    )
}