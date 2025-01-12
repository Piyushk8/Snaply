"use client";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface ClientCldImageProps {
  src?: string | null; // Optional for cases where `src` may not be provided
  classname?: string;
  size?: number; // Size defaults handled in the logic
  alt?: string;
  height?: number;
  width?: number;
}

const ClientCldImage: React.FC<ClientCldImageProps> = ({
  src,
  height = 50,
  width = 50,
  alt = "User avatar", // Default alt text
  classname = "",
}) => {
 
  // Ensure `src` is a string before trimming
  const imageSrc = typeof src === 'string' && src.trim() ? src : "Avatars/avatar_18022b04-e9fe-4d0b-860c-ed1a710cbd31"; 

  return (
    <>
    <CldImage
      width={width}
      height={height}
      className={cn("mx-auto rounded-full", classname)} // Combine default and custom classnames
      alt={alt}
      src={imageSrc} // Provide the source to Cloudinary component
    />
         
    </>
  );
};

export default ClientCldImage;
