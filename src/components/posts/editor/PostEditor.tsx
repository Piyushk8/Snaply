"use client";

import { useSession } from "next-auth/react";
import ClientCldImage from "@/components/CldImage";
import { TextareaForm } from "./TextArea";


export default function PostEditor() {
  const { data: session } = useSession();
    
    let Image = session?.user.image
   setInterval(() => {
       Image = session?.user?.image
       setTimeout(() => {
        Image=""
    }, 2000);
   }, 5000);
  return (
    <div className=" rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center">
        <ClientCldImage
          src={Image} // Fallback Cloudinary avatar
          size={50}
          alt={`${session?.user?.name || "User"}'s avatar`} // Add meaningful alt text
          classname="hidden sm:inline" // Additional styling
        />
        <TextareaForm />
      </div>
    </div>
    
  );
}
