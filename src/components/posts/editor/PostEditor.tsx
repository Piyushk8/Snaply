"use client";

import { useSession } from "next-auth/react";
import ClientCldImage from "@/components/CldImage";
import { TextareaForm } from "./TextArea";
import { useMediaUpload } from "./useMediaUpload";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";


export default function PostEditor() {
  const { data: session } = useSession();
    let Image = session?.user.image
   
  return (
    <div className="bg-card border-border border rounded-2xl p-5 shadow-sm">
      <div className="flex items-start ">
        <ClientCldImage
          src={Image} // Fallback Cloudinary avatar
          size={50}
          alt={`${session?.user?.name || "User"}'s avatar`} // Add meaningful alt text
          classname="hidden sm:inline" // Additional styling
        />
        <TextareaForm/>
      </div>
    </div>
    
  );
}


