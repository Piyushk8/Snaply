import React, { useState } from "react";
import { Media } from "@prisma/client";
import { CldImage, getCldVideoUrl } from "next-cloudinary";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import VideoCard from "../VideoCard";

export const MediaCarousel = ({ mediaItems }: { mediaItems: Media[] }) => {
  if (!mediaItems?.length) return null;
  const videos  = {}
  return (

      <Carousel>
        {mediaItems.map((media, index) => (
          <div 
            key={index} 
            className=" max-w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden"
          >
            {media?.type === "IMAGE" ? (
              <CldImage
                src={media.publicId}
                alt={`Media ${index}`}
                // aspectRatio="4:3"
                sizes="(max-width:768px) 100vw , (max-width:1200px) 50vw ,10vw"
                width={410}
                height={300}
                crop="fill_pad"
              />
            ) : (
              
                 <VideoCard
                    video={{ publicId: media.publicId }}
                    onDownload={() => console.log("Download video")}
                /> 
            )}
          </div>
        ))}
      </Carousel>
  );
};

export const Carousel = ({ children }: { children: React.ReactNode }) => {
  const [current, setCurrent] = useState(0);
  const childrenArray = React.Children.toArray(children);

  const prev = () => {
    setCurrent((current) =>
      current === 0 ? childrenArray.length - 1 : current - 1
    );
  };

  const next = () => {
    setCurrent((current) =>
      current === childrenArray.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="sm:w-3/4 md:w-3/5 lg:w-full ">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
            width: `${childrenArray.length * 100}%`,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>

        {childrenArray.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="p-1 rounded-full shadow bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="p-1 rounded-full shadow bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="absolute bottom-2 left-0 right-0">
              <div className="flex justify-center gap-1">
                {childrenArray.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrent(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === current ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;