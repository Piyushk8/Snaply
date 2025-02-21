import React, { useState } from "react";
import { Media } from "@prisma/client";
import { CldImage, getCldVideoUrl } from "next-cloudinary";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import VideoCard from "../VideoCard";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export const MediaCarousel = ({ mediaItems }: { mediaItems: Media[] }) => {
  if (!mediaItems?.length) return null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <Carousel>
      {mediaItems.map((media, index) => (
        <div
          key={index}
          className="relative max-w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        >
          <div
            className="absolute inset-0 z-10"
            onClick={() => {
              setCurrentImageIndex(index);
              setIsModalOpen(true);
              setScale(1);
            }}
          />

          {media?.type === "IMAGE" ? (
            <div className="relative w-full h-full">
              <CldImage
                src={media.publicId}
                alt={`Media ${index}`}
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 10vw"
                width={410}
                height={300}
                crop="fill_pad"
                className="pointer-events-none"
              />

              <Dialog
                open={isModalOpen && media?.type === "IMAGE"}
                onOpenChange={() => {
                  setIsModalOpen(false);
                  setScale(1);
                }}
              >
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
                  <DialogTitle></DialogTitle>
                  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />

                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Close button */}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={20} />
                    </button>

                    {/* Image controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        disabled={scale <= 1}
                      >
                        <ZoomOut size={20} />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        disabled={scale >= 3}
                      >
                        <ZoomIn size={20} />
                      </button>
                      <button
                        onClick={() => {
                          /* Add download logic */
                        }}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>

                    {/* Navigation arrows */}
                    {mediaItems.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ArrowLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ArrowRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Main image */}
                    <div className="relative transition-transform duration-300 ease-out">
                      {media?.type === "IMAGE" ? (
                        <CldImage
                          src={mediaItems[currentImageIndex].publicId}
                          alt={`Full preview ${currentImageIndex}`}
                          width={1200}
                          height={800}
                          crop="fill_pad"
                          className="max-w-[90vw] max-h-[85vh] object-contain transition-transform duration-300"
                          style={{
                            transform: `scale(${scale})`,
                          }}
                        />
                      ) : (
                        <video
                          src={getCldVideoUrl({
                            src: media?.publicId,
                            height: 800,
                            width: 1200,
                          })}
                          autoPlay
                          controls
                          muted
                        />
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <VideoCard
                video={{ publicId: media.publicId }}
                onDownload={() => console.log("Download video")}
              />
            </div>
          )}
        </div>
      ))}
    </Carousel>
  );
};
export const Carousel = ({ children }: { children: React.ReactNode }) => {
  const [current, setCurrent] = useState(0);
  const childrenArray = React.Children.toArray(children);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((current) =>
      current === 0 ? childrenArray.length - 1 : current - 1
    );
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((current) =>
      current === childrenArray.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div
      className="sm:w-3/4 md:w-3/5 lg:w-full"
      onClick={(e) => e.stopPropagation()} // Stop propagation at carousel level
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
            width: `${childrenArray.length * 100}%`,
          }}
          onClick={(e) => e.stopPropagation()} // Stop propagation at transform wrapper
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              onClick={(e) => e.stopPropagation()} // Stop propagation at slide wrapper
            >
              {child}
            </div>
          ))}
        </div>

        {childrenArray.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev(e);
                }}
                className="p-1 rounded-full shadow bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto z-20"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next(e);
                }}
                className="p-1 rounded-full shadow bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto z-20"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="absolute bottom-2 left-0 right-0 z-20">
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

export const MediaGrid = ({ media }: { media: Media[] }) => {
  const [activeMedia, setActiveMedia] = useState<Media | null>(null);

  // Determine grid layout based on number of media items
  const getGridClass = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2 grid-rows-2";
      case 4:
        return "grid-cols-2 grid-rows-2";
      default:
        return "grid-cols-3";
    }
  };

  // Determine individual media item class
  const getMediaClass = (index: number, total: number) => {
    if (total === 1) return "col-span-1 row-span-1 w-full h-auto";
    if (total === 2) return "aspect-square";
    if (total === 3) {
      return index === 0 ? "col-span-2 row-span-1 w-full" : "aspect-square";
    }
    if (total === 4) {
      return "aspect-square";
    }
    return "aspect-square";
  };

  const renderMedia = (item:Media, index: any) => {
    const isVideo = item?.type === "VIDEO"
    // const MediaComponent = isVideo ? CldVideo : CldImage;

    return (
      <div
        key={index}
        className={`flex justify-center items-center relative overflow-hidden rounded-2xl ${getMediaClass(index, media.length)}`}
        onClick={() => setActiveMedia(item)}
      >
        {isVideo ? (
          <video
            onClick={(e)=>e.stopPropagation()}
            autoPlay
            loop
            width={1200}
            height={1200}
            src={getCldVideoUrl({
              src:item?.publicId,
              quality:"auto",
              crop:"fill_pad"
            })}
            controls
            className="bg-muted max-w-full max-h-full"
          />
        ) : (
          <CldImage
            width={800}
            height={800}
            src={item.publicId}
            alt={`Media ${index + 1}`}
            className="w-full bg-muted h-full object-cover"
            crop="fill"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`grid gap-1 ${getGridClass(media.length)}`}>
      {media.map(renderMedia)}

      {/* Lightbox/Modal for full view */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setActiveMedia(null)}
        >
          <div className="max-w-full max-h-full">
            {activeMedia.type === "VIDEO" ? (
              <video
                width={1200}
                height={1200}
                src={getCldVideoUrl({
                  src: activeMedia?.publicId,
                })}
                controls
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="relative">
                <CldImage
                onClick={(e)=>e.stopPropagation()}
                width={1200}
                height={1200}
                src={activeMedia.publicId}
                alt={"Full view"}
                className="bg-primary-foreground max-w-full max-h-full"
                crop="fill"
              />
              <X size={40} className="absolute text-gray-700 bg-neutral-200 p-3 rounded-full top-3 right-3"></X>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
