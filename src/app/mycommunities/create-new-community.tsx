"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface CreatenewCommunityProps {
  children: React.ReactNode;
}
export const CreateNewCommunity = ({ children }: CreatenewCommunityProps) => {
  const router=useRouter()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
 
  const[loading,setLoading]=useState(false)
   const uploadurl = useMutation(api.upload.generateUploadUrl);
   const createCommunity=useMutation(api.communities.createCommunity);
  const handleFormSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(image!==null){
        setLoading(true);
        const posturl = await uploadurl();
        const result = await fetch(posturl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) {
          throw new Error("upload failed");
        };
        const { storageId } = await result.json();
        const response=await createCommunity({
          name:name,
          description:description,
          isPublic:true,
          imageUrl:storageId
        });
        if(response){
          toast.success("community created");
          router.push(`/mycommunities/communityid/${response.communityId}/channel/${response.channelid}`)
        }
      };

    }catch(error){
      toast.error("failed to create a community");
    

    }finally{
      setLoading(false);
      setName("");
      setDescription("");
      setImage(null);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create new Community</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <form onSubmit={handleFormSubmit}>
            <div className="">
              <Label
                className="pb-2 block text-sm/6 font-medium text-gray-900"
                htmlFor="name"
              >
                Name of the community
              </Label>
              <Input
                id="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="climate ..."
                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>
            <div className="">
              <Label className="py-2" htmlFor="des">
                Description of the community
              </Label>
              <Textarea
                id="des"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                placeholder="climate ..."
                className="fblock w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            {image !== null ? (
              <div className="relative my-2">
                <img src={URL.createObjectURL(image)} alt="Thumb" className="" />
                <Button type="button" variant="ghost" className="absolute -top-6 -right-6" size="icon"><X onClick={()=>setImage(null)} className="text-rose-500 cursor-pointer rounded-full border border-red-500"/></Button>
              </div>
            ) : (
              <>
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        className="mx-auto size-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            required
                            className="sr-only cursor-pointer"
                            onChange={(e) => setImage(e.target.files![0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <DialogFooter className="flex items-center justify-between mt-2">
              <DialogClose asChild onClick={(e) => e.stopPropagation()}>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>Confirm</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
