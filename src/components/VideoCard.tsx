import React, { useState, useCallback } from 'react';
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Clock } from "lucide-react";

interface VideoCardProps {
  video: {
    publicId: string;
    duration?: number;
  };
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 500,
      crop:"fill",
      height:380,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
    });
  }, []);
  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 500,
      crop:"fill",
      height:380,
    });
  }, []);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width:410,
      height:300,
      crop:"fill_pad",
      gravity: "auto",
      format: "jpg",
      assetType: "video"
    });
  }, []);

  return (
    <div 
      className="relative w-full h-full bg-gray-100 cursor-pointer"
      onMouseEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse enter');
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse leave');
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const fullUrl = getCldVideoUrl({
          src: video.publicId,
          width: 1920,
          height: 1080,
        });
        onDownload(fullUrl, video.publicId);
      }}
    >
      {isHovered ? (
        !previewError ? (
          <video
            className="w-full h-full object-cover"
            src={getFullVideoUrl(video.publicId)}
            autoPlay
            muted
            controls={isHovered}
            loop
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Preview not available</p>
          </div>
        )
      ) : (
        <img
          src={getThumbnailUrl(video.publicId)}
          alt="Video thumbnail"
        />
      )}

      {video?.duration && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default VideoCard;