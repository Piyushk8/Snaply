"use client";

import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface ClientCldImageProps {
  src?: string | null; // Optional for cases where `src` may not be provided
  classname?: string;
  size?: number; // Size defaults handled in the logic
  alt?: string;
}

const ClientCldImage: React.FC<ClientCldImageProps> = ({
  src,
  size = 48, // Default size
  alt = "User avatar", // Default alt text
  classname = "",
}) => {
  return (
    <CldImage
      width={size}
      height={size}
      className={cn("mx-auto rounded-full", classname)} // Combine default and custom classnames
      alt={alt}
      src={src || "Avatars/ggmswp9zqo3za87f9npu"} // Fallback Cloudinary avatar
    />
  );
};

export default ClientCldImage;
